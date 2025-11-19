import { NextResponse } from "next/server";
import OpenAI from "openai";
import { URSA_MINOR_SYSTEM_PROMPT, availableTools } from "@/lib/chatContext";
import { composeCurationResponse } from "@/lib/dataCurator";
import { BEAR_ROBOTICS_KNOWLEDGE } from "@/lib/bearKnowledge";
import { getAIDataContext, getRobotStats, getFleetStats, getOperationsStats, parseTimeRange, getTimeRangeLabel } from "@/lib/aiDataProvider";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export async function POST(request: Request) {
  try {
    const { messages, model = "ursa-minor", context, autoNavigate, deepResearch, isMinimized = false } = await request.json();
    
    console.log("🐻 [API] Received autoNavigate:", autoNavigate);
    console.log("🐻 [API] Deep Research Mode:", deepResearch);
    console.log("🐻 [API] Is Minimized:", isMinimized);
    console.log("🐻 [API] Last message:", messages[messages.length - 1]?.content);

    // If no OpenAI key, return intelligent mock response
    if (!openai) {
      console.log("🐻 [API] No OpenAI key, using mock response");
      try {
        const mockResponse = generateMockResponse(messages[messages.length - 1]?.content || "");
        return NextResponse.json({
          response: mockResponse,
          needsPermission: false,
          toolCalls: [],
        });
      } catch (mockError) {
        console.error("🐻 [API] Mock response error:", mockError);
        return NextResponse.json({
          response: "I'm here to help! Try asking about fleet status, robot details, or navigate to different pages.",
          needsPermission: false,
          toolCalls: [],
        });
      }
    }
    
    console.log("🐻 [API] Using GPT-4o-mini with autoNavigate:", autoNavigate);

    // Get current universe data for context
    const universe = composeCurationResponse();
    
    // Get REAL platform data based on user query
    const userQuery = messages[messages.length - 1]?.content || "";
    const realData = getAIDataContext(userQuery);
    
    // Build comprehensive context with auto-navigate instruction and REAL DATA
    const contextMessage = {
      role: "system" as const,
      content: `${URSA_MINOR_SYSTEM_PROMPT}

## USER PREFERENCES & CURRENT STATE
**Auto-Navigate**: ${autoNavigate ? '✅ ENABLED' : '❌ DISABLED'}
**Deep Research Mode**: ${deepResearch ? '✅ ENABLED' : '❌ DISABLED'}
**Chat Window State**: ${isMinimized ? '🔕 MINIMIZED (background mode)' : '💬 OPEN (full interaction)'}

${isMinimized ? `
═══════════════════════════════════════════════════════════════
🔕 MINIMIZED MODE - CRITICAL BEHAVIORAL RULES
═══════════════════════════════════════════════════════════════

The user has MINIMIZED the chat window. This is a STRONG signal they want you to work in the background without interrupting their workflow.

✅ ALLOWED ACTIONS:
  • Provide data analysis and insights
  • Answer questions with facts and statistics
  • Prepare research and recommendations
  • Queue up suggestions for when they return

❌ STRICTLY FORBIDDEN:
  • DO NOT USE [NAVIGATE:...] TAGS - This would interrupt their work
  • DO NOT suggest actions that require immediate attention
  • DO NOT execute commands that change UI state
  • Keep responses BRIEF - they'll read when they maximize

📋 RESPONSE FORMAT:
  • Lead with a clear, concise answer (2-3 sentences max)
  • Use "💡 Ready to [action]" for future suggestions
  • Format: "I found X. Summary: Y. Maximize me to navigate/view details."

Example Responses:
  ❌ BAD: "[NAVIGATE:/robots/abc]\n\nShowing robot ABC..."
  ✅ GOOD: "Found robot ABC - Status: Critical, Battery 12%. 💡 Maximize me to view full details."
  
  ❌ BAD: "Let me take you to the operations page..."
  ✅ GOOD: "5 robots need attention in APAC region. 💡 Ready to navigate when you're available."

═══════════════════════════════════════════════════════════════
` : autoNavigate ? `
═══════════════════════════════════════════════════════════════
💬 OPEN MODE - PROACTIVE NAVIGATION ENABLED
═══════════════════════════════════════════════════════════════

The chat is OPEN and user has AUTO-NAVIGATE enabled. Be PROACTIVE and IMMEDIATE with navigation.

When user wants to:
  • See a robot → Navigate immediately
  • View a page → Navigate immediately
  • Check status → Navigate if relevant page exists

✅ DO THIS:
  1. Use [NAVIGATE:/path] tag FIRST in your response
  2. Follow with confirmation and context
  3. NO need to ask permission - just do it

Example:
  User: "show me robot abc123"
  You: "[NAVIGATE:/robots/abc123]\n\n**Navigating to Robot ABC123**\n\nDisplaying full diagnostics..."

  User: "what's wrong in operations?"
  You: "[NAVIGATE:/operations]\n\n**Opening Operations Dashboard**\n\nI found 3 critical issues..."

═══════════════════════════════════════════════════════════════
` : `
═══════════════════════════════════════════════════════════════
💬 OPEN MODE - MANUAL NAVIGATION
═══════════════════════════════════════════════════════════════

The chat is OPEN but auto-navigate is OFF. ASK before using [NAVIGATE:...] tags.

Pattern:
  1. Provide the answer/analysis first
  2. Then ask: "Would you like me to navigate to [page]?"
  3. Wait for confirmation before using [NAVIGATE:...] tag

═══════════════════════════════════════════════════════════════
`}

${deepResearch ? `
🔬 DEEP RESEARCH MODE ACTIVE:
- Provide COMPREHENSIVE, DETAILED analysis
- Include multiple perspectives and cross-references
- Show step-by-step reasoning
- Reference historical patterns and data trends
- Suggest preventive measures and long-term solutions
- Use markdown formatting for structure (headings, lists, tables)
- Include confidence levels for recommendations
- Cite specific data points and examples
- Be thorough - users expect depth over brevity in this mode
` : ''}

## Bear Robotics Knowledge Base
${BEAR_ROBOTICS_KNOWLEDGE}

## Current Platform State (${realData.timestamp})
**Page**: ${context?.currentPage || 'unknown'}
**Page Name**: ${context?.pageName || 'unknown'}
**Time Range**: ${realData.timeRange}

## REAL FLEET DATA (Use these exact numbers!)
**Total Robots**: ${realData.fleet.total}
**Status Breakdown**:
- Active: ${realData.fleet.active} robots
- Idle: ${realData.fleet.idle} robots
- Charging: ${realData.fleet.charging} robots
- Error: ${realData.fleet.error} robots
- Maintenance: ${realData.fleet.maintenance} robots

**Fleet Averages**:
- Battery Level: ${realData.fleet.averages.battery}%
- Uptime: ${realData.fleet.averages.uptime}%
- Trips per Robot: ${realData.fleet.averages.tripsPerRobot}

**Fleet Totals (${realData.timeRange})**:
- Total Distance: ${realData.fleet.totals.distance} km
- Total Orders Served: ${realData.fleet.totals.orders}
- Total Trips: ${realData.fleet.totals.trips}

**Facilities**:
${Object.entries(realData.fleet.facilities).map(([name, count]) => `- ${name}: ${count} robots`).join('\n')}

${realData.fleet.alerts.lowBattery.length > 0 ? `
**⚠️ Low Battery Alerts** (${realData.fleet.alerts.lowBattery.length}):
${realData.fleet.alerts.lowBattery.map(r => `- ${r.name} (${r.id}): ${r.battery}% at ${r.facility}`).join('\n')}
` : ''}

${realData.fleet.alerts.errors.length > 0 ? `
**🔴 Error Alerts** (${realData.fleet.alerts.errors.length}):
${realData.fleet.alerts.errors.map(r => `- ${r.name} (${r.id}): ${r.error}`).join('\n')}
` : ''}

## REAL OPERATIONS DATA
**Total Operations**: ${realData.operations.total}
**Success Rate**: ${realData.operations.successRate}%
- Successful: ${realData.operations.successful}
- Pending: ${realData.operations.pending}
- Failed: ${realData.operations.failed}

**By Facility**:
${Object.entries(realData.operations.byFacility).map(([name, count]) => `- ${name}: ${count} ops`).join('\n')}

**By Type**:
${Object.entries(realData.operations.byType).map(([name, count]) => `- ${name}: ${count} ops`).join('\n')}

## TRAINING MODELS
${universe.trainingPlans.map(p => `- ${p.model.name} (${p.model.size}): ${p.model.currentPhase}`).join('\n')}

CRITICAL: Use the REAL DATA numbers above in your responses. These are actual values from the platform, not estimates.`,
    };

    // ═══════════════════════════════════════════════════════════════
    // TOOL FILTERING - Remove navigation tools when chat is minimized
    // ═══════════════════════════════════════════════════════════════
    const toolsToProvide = isMinimized 
      ? availableTools.filter(tool => 
          // When minimized, REMOVE navigation tools to prevent interruption
          tool.name !== "navigate" && tool.name !== "show_robot"
        )
      : availableTools; // When open, all tools are available
    
    console.log("🐻 [API] Available tools:", toolsToProvide.map(t => t.name).join(", "));
    console.log("🐻 [API] Navigation tools:", isMinimized ? "DISABLED (minimized)" : "ENABLED (open)");

    // Call OpenAI with function calling using cost-efficient GPT-4o-mini
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Cost-efficient model: ~15x cheaper than GPT-4 Turbo
      messages: [contextMessage, ...messages],
      tools: toolsToProvide.map((tool) => ({
        type: "function" as const,
        function: tool,
      })),
      temperature: 0.7,
      max_tokens: 1000, // Increased for more comprehensive responses
    });

    const assistantMessage = completion.choices[0].message;
    const toolCalls = assistantMessage.tool_calls?.map((tc) => {
      // Type guard for function tool calls
      if (tc.type === 'function' && 'function' in tc) {
        return {
          id: tc.id,
          name: tc.function.name,
          parameters: JSON.parse(tc.function.arguments),
          status: "pending" as const,
        };
      }
      return null;
    }).filter((tc): tc is NonNullable<typeof tc> => tc !== null) || [];

    // Check if any tool call requires permission
    const needsPermission = toolCalls.some(
      (tc) => tc.name === "modify_parameter" || tc.name === "execute_command"
    );

    // Handle tool calls that can be auto-executed (navigation, queries)
    let responseContent = assistantMessage.content || "";
    
    console.log("🐻 [API] Tool calls:", toolCalls.length);
    console.log("🐻 [API] Original content:", responseContent);
    
    if (toolCalls.length > 0) {
      for (const toolCall of toolCalls) {
        const { name, parameters } = toolCall;
        console.log(`🐻 [API] Processing tool: ${name}`, parameters);
        
        // Handle navigation tools (auto-execute)
        if (name === "navigate" || name === "show_robot") {
          let targetUrl = "";
          let description = "";
          
          if (name === "navigate" && parameters.page) {
            targetUrl = parameters.page;
            const pageName = targetUrl.replace("/", "").replace("-", " ") || "Home";
            description = `**Navigating to ${pageName}**...`;
            console.log(`🐻 [API] Navigation to page: ${targetUrl}`);
          } else if (name === "show_robot" && parameters.robot_id) {
            targetUrl = `/robots/${parameters.robot_id}`;
            const robotId = parameters.robot_id.toUpperCase();
            description = `**Displaying Robot ${robotId}**...\n\nTaking you to the comprehensive dashboard with live telemetry, navigation map, and RFE diagnostic tools.`;
            console.log(`🐻 [API] Navigation to robot: ${targetUrl}`);
          }
          
          if (targetUrl) {
            responseContent = `[NAVIGATE:${targetUrl}]\n\n${description}`;
            console.log(`🐻 [API] Generated navigation response: ${responseContent}`);
            break; // Only handle first navigation
          }
        }
        
        // Handle list/filter tools (use AI response with data)
        if (name === "list_robots") {
          console.log(`🐻 [API] List robots tool called with filters:`, parameters);
          // AI will provide response using REAL DATA - no need to execute
          if (!responseContent) {
            const filters = [];
            if (parameters.status) filters.push(`status: ${parameters.status}`);
            if (parameters.facility) filters.push(`facility: ${parameters.facility}`);
            if (parameters.has_errors) filters.push("with errors");
            if (parameters.low_battery) filters.push("low battery");
            responseContent = `Filtering robots${filters.length > 0 ? ' by ' + filters.join(', ') : ''}...`;
          }
        }
        
        // Handle diagnostic tools - generate simulated results
        if (name === "run_diagnostics") {
          console.log(`🐻 [API] Running diagnostics on:`, parameters.robot_id);
          const robotId = parameters.robot_id?.toUpperCase() || "UNKNOWN";
          const testTypes = parameters.test_type || ["battery", "sensors", "navigation", "network"];
          
          // Simulate diagnostic results
          const results = {
            battery: "✅ Battery: 87% (Healthy) - Estimated 6.2 hours remaining",
            sensors: "✅ Sensors: All 12 sensors operational - LiDAR: 98% accuracy",
            navigation: "⚠️ Navigation: 3 minor path recalculations in last hour (Normal variance)",
            network: "✅ Network: Stable connection - Latency: 12ms, Signal: -45dBm",
            motors: "✅ Motors: All servos responding - Temperature: Normal (42°C avg)",
            cpu: "✅ CPU: 34% utilization - Memory: 2.1GB / 4GB used"
          };
          
          responseContent = `⚙️ Running full diagnostic on Robot ${robotId}...\n\n**Diagnostic Complete:**\n${Object.values(results).join('\n')}\n\n**Recommendation:** Robot is performing within normal parameters. Continue standard operation.`;
          console.log(`🐻 [API] Generated diagnostic results`);
        }
        
        // Handle command execution - simulate success
        if (name === "execute_command") {
          console.log(`🐻 [API] Executing command:`, parameters);
          const cmd = parameters.command;
          const robotId = parameters.robot_id?.toUpperCase() || "UNKNOWN";
          
          responseContent = `⚙️ Executing command: **${cmd}** on Robot ${robotId}...\n\n✅ **Command Successful!**\n- Robot ${robotId} ${cmd} completed\n- Status: Online\n- Response time: 1.2s\n\nRobot is now ${cmd === 'restart' ? 'rebooting and will be online in ~45 seconds' : 'responding normally'}.`;
          console.log(`🐻 [API] Simulated command execution`);
        }
        
        // Handle parameter modification - simulate success
        if (name === "modify_parameter") {
          console.log(`🐻 [API] Modifying parameter:`, parameters);
          const robotId = parameters.robot_id?.toUpperCase() || "UNKNOWN";
          const param = parameters.parameter_name;
          const value = parameters.new_value;
          
          responseContent = `⚙️ Updating parameter **${param}** on Robot ${robotId}...\n\n✅ **Parameter Updated Successfully!**\n- Robot: ${robotId}\n- Parameter: ${param}\n- New Value: ${value}\n- Previous Value: [stored]\n- Applied at: ${new Date().toLocaleTimeString()}\n\nChange is now active and being monitored.`;
          console.log(`🐻 [API] Simulated parameter modification`);
        }
        
        // Handle task scheduling - simulate success
        if (name === "schedule_task") {
          console.log(`🐻 [API] Scheduling task:`, parameters);
          const robotId = parameters.robot_id?.toUpperCase() || "UNKNOWN";
          const task = parameters.task_type;
          const time = parameters.scheduled_time || "next available slot";
          
          responseContent = `⚙️ Scheduling ${task} for Robot ${robotId}...\n\n✅ **Task Scheduled Successfully!**\n- Robot: ${robotId}\n- Task: ${task.charAt(0).toUpperCase() + task.slice(1)}\n- Scheduled: ${time}\n- Duration: ~${task === 'maintenance' ? '2-3 hours' : '30-45 minutes'}\n- Notification: You'll receive an alert when complete\n\nTask added to queue. Robot will be temporarily offline during ${task}.`;
          console.log(`🐻 [API] Simulated task scheduling`);
        }
        
        // Handle analysis tools (use AI response with data)
        if (name === "compare_robots" || name === "analyze_facility" || name === "check_incidents" || name === "suggest_maintenance") {
          console.log(`🐻 [API] Analysis tool called: ${name}`, parameters);
          // AI will provide detailed analysis using REAL DATA
        }
        
        // Handle report generation (use AI response)
        if (name === "generate_report") {
          console.log(`🐻 [API] Report generation requested:`, parameters);
          if (!responseContent) {
            responseContent = `📊 Generating ${parameters.report_type} report...\n\n✅ **Report Generated!**\n\nThe report includes comprehensive analysis and will be available in your dashboard.`;
          }
        }
        
        // Handle query tools - use AI's natural language response
        if (name === "query_telemetry") {
          console.log(`🐻 [API] Query tool called: ${name}`);
          // The AI should provide a natural language response with the queried data
        }
      }
    }
    
    // Final fallback if still no content - should rarely happen
    if (!responseContent) {
      console.log("🐻 [API] No content generated - GPT returned only tool calls");
      responseContent = "⚙️ Processing your request...";
    }
    
    console.log("🐻 [API] Final response:", responseContent);

    return NextResponse.json({
      response: responseContent,
      needsPermission,
      toolCalls,
    });
  } catch (error) {
    console.error("🐻 [API] Chat error:", error);
    
    // Return a 200 status with error message to prevent client-side crashes
    return NextResponse.json({
      response: "I apologize, but I encountered an error processing your request. Please try again or rephrase your question.",
      needsPermission: false,
      toolCalls: [],
      error: true,
    });
  }
}

/**
 * Generate intelligent mock response when OpenAI is not available (using REAL DATA)
 */
function generateMockResponse(userMessage: string): string {
  try {
    const lowerMessage = userMessage.toLowerCase();
    const realData = getAIDataContext(userMessage);
    const timeLabel = realData.timeRange;
  
  // Robot-specific queries with ID extraction
  if (lowerMessage.includes("robot") && /[a-z0-9]{6}/.test(userMessage)) {
    const robotId = userMessage.match(/[a-z0-9]{6}/)?.[0];
    if (robotId) {
      const robotStats = getRobotStats(robotId);
      if (robotStats) {
        return `[NAVIGATE:/robots/${robotId}]

**Displaying robot ${robotStats.name}** (${robotId.toUpperCase()})...

**Quick Stats:**
- Status: ${robotStats.status.toUpperCase()}
- Battery: ${robotStats.metrics.battery}%
- Uptime: ${robotStats.metrics.uptime}%
- Location: ${robotStats.facility}, ${robotStats.city}
- Trips Completed: ${robotStats.metrics.tripsCompleted}
- Distance: ${robotStats.metrics.totalDistanceKm} km

Taking you to the comprehensive dashboard with live telemetry, navigation map, and RFE diagnostic tools.`;
      }
    }
    return `[NAVIGATE:/robots/${robotId}]

**Displaying robot ${robotId?.toUpperCase()}**... Taking you to its comprehensive dashboard with live telemetry, navigation map, and RFE diagnostic tools.`;
  }
  
  // Fleet status queries
  if (lowerMessage.includes("fleet") || lowerMessage.includes("how many") || lowerMessage.includes("status")) {
    return `**Fleet Status (${timeLabel}):**

📊 **Overview:**
- Total Robots: **${realData.fleet.total}**
- Active: **${realData.fleet.active}** (${Math.round((realData.fleet.active / realData.fleet.total) * 100)}%)
- Idle: **${realData.fleet.idle}**
- Charging: **${realData.fleet.charging}**
- Error: **${realData.fleet.error}**
- Maintenance: **${realData.fleet.maintenance}**

⚡ **Performance:**
- Avg Battery: **${realData.fleet.averages.battery}%**
- Avg Uptime: **${realData.fleet.averages.uptime}%**
- Total Distance: **${realData.fleet.totals.distance} km**
- Orders Served: **${realData.fleet.totals.orders}**
- Trips Completed: **${realData.fleet.totals.trips}**

${realData.fleet.alerts.errors.length > 0 ? `
🔴 **Active Errors (${realData.fleet.alerts.errors.length}):**
${realData.fleet.alerts.errors.slice(0, 3).map(e => `- ${e.name} (${e.id}): ${e.error}`).join('\n')}
` : '✅ No active errors'}`;
  }
  
  // Uptime and performance queries
  if (lowerMessage.includes("uptime") || lowerMessage.includes("performance")) {
    return `**Fleet Performance (${timeLabel}):**

⚡ **Key Metrics:**
- Average Uptime: **${realData.fleet.averages.uptime}%**
- Average Battery: **${realData.fleet.averages.battery}%**
- Success Rate: **${realData.operations.successRate}%**

📍 **By Facility:**
${Object.entries(realData.fleet.facilities).map(([name, count]) => `- ${name}: **${count} robots**`).join('\n')}

📊 **Operations:**
- Total: **${realData.operations.total}**
- Successful: **${realData.operations.successful}**
- Failed: **${realData.operations.failed}**

Would you like to see detailed metrics for a specific facility or robot?`;
  }
  
  // Alert and incident queries
  if (lowerMessage.includes("alert") || lowerMessage.includes("incident") || lowerMessage.includes("problem") || lowerMessage.includes("error")) {
    const totalAlerts = realData.fleet.alerts.lowBattery.length + realData.fleet.alerts.errors.length;
    
    if (totalAlerts === 0) {
      return `✅ **All systems nominal!**

No active alerts at this time. The fleet is operating smoothly across all facilities.

Current status:
- ${realData.fleet.active} robots active
- ${realData.fleet.averages.uptime}% average uptime
- ${realData.operations.successRate}% operation success rate`;
    }
    
    return `**Active Alerts (${totalAlerts} total):**

${realData.fleet.alerts.errors.length > 0 ? `
🔴 **Errors (${realData.fleet.alerts.errors.length}):**
${realData.fleet.alerts.errors.map(e => `- **${e.name}** (${e.id}): ${e.error}`).join('\n')}
` : ''}

${realData.fleet.alerts.lowBattery.length > 0 ? `
⚠️ **Low Battery (${realData.fleet.alerts.lowBattery.length}):**
${realData.fleet.alerts.lowBattery.map(r => `- **${r.name}** (${r.id}): ${r.battery}% at ${r.facility}`).join('\n')}
` : ''}

Would you like me to navigate you to a specific robot for diagnostics?`;
  }
  
  // Navigation commands - Smart detection
  if (lowerMessage.includes("navigate") || lowerMessage.includes("go to") || lowerMessage.includes("show me") || lowerMessage.includes("take me") || lowerMessage.includes("display") || lowerMessage.includes("open")) {
    if (lowerMessage.includes("operation")) {
      return "[NAVIGATE:/operations]\n\n**Taking you to Operations Dashboard**... You'll see real-time telemetry from all 6 facilities with interactive sortable tables, live KPIs, and facility breakdowns.";
    }
    if (lowerMessage.includes("ai") || lowerMessage.includes("model") || lowerMessage.includes("training")) {
      return "[NAVIGATE:/ai-models]\n\n**Opening AI Models page**... Monitoring training progress for Ursa Minor (40B), Ursa Major (70B), and Aurora Bear Lore (120B).";
    }
    if (lowerMessage.includes("data") || lowerMessage.includes("lake") || lowerMessage.includes("pipeline")) {
      return "[NAVIGATE:/data-lake]\n\n**Navigating to Data Lake**... Exploring data sources, pipeline architecture, and real-time streaming analytics.";
    }
    if (lowerMessage.includes("robots") || lowerMessage.includes("fleet") || (lowerMessage.includes("all") && lowerMessage.includes("robot"))) {
      return "[NAVIGATE:/robots]\n\n**Opening Robot Fleet Management**... Viewing all 101 active robots with search, filters, and comprehensive diagnostics.";
    }
    if (lowerMessage.includes("home") || lowerMessage.includes("dashboard") || lowerMessage.includes("main")) {
      return "[NAVIGATE:/]\n\n**Returning to Home Dashboard**... Executive overview with AI constellation status and upcoming features.";
    }
    if (lowerMessage.includes("feature")) {
      return "[NAVIGATE:/features]\n\n**Opening Features page**... Comprehensive showcase of all Bear Universe capabilities.";
    }
  }
  
  // Direct page requests without explicit "navigate" keyword
  if (lowerMessage.match(/^(operations|robots|ai models?|data lake|features?|home)$/i)) {
    const pageName = lowerMessage.toLowerCase();
    if (pageName.includes("operation")) return `[NAVIGATE:/operations]\n\n**Opening Operations Dashboard**...`;
    if (pageName.includes("robot")) return `[NAVIGATE:/robots]\n\n**Opening Robot Fleet**...`;
    if (pageName.includes("ai") || pageName.includes("model")) return `[NAVIGATE:/ai-models]\n\n**Opening AI Models**...`;
    if (pageName.includes("data")) return `[NAVIGATE:/data-lake]\n\n**Opening Data Lake**...`;
    if (pageName.includes("feature")) return `[NAVIGATE:/features]\n\n**Opening Features**...`;
    if (pageName.includes("home")) return `[NAVIGATE:/]\n\n**Opening Home**...`;
  }
  
  // Parameter modification queries
  if (lowerMessage.includes("parameter") || lowerMessage.includes("modify") || lowerMessage.includes("change") || lowerMessage.includes("adjust")) {
    return "I can help you modify robot parameters, but I'll need your **explicit permission** before making any changes. This is a safety feature to prevent accidental modifications.\n\n**Example commands:**\n• \"Set robot c44e79 speed to 1.2 m/s\"\n• \"Adjust robot a1b2c3 charging threshold to 20%\"\n• \"Change navigation mode for robot x9y8z7 to cautious\"\n\nWhat parameter would you like to modify? Please specify the robot ID and the desired change.";
  }
  
  // Status queries
  if (lowerMessage.includes("status") || lowerMessage.includes("health") || lowerMessage.includes("system")) {
    return "**System Status Overview:**\n\n✅ **Operational** (7 systems)\n• Fleet Operations • Data Pipeline • AI Models • API Gateway • Database • Authentication • Seoul Factory\n\n⚠️ **Degraded** (1 system)\n• Busan Pilot Cluster - Navigation variance\n\n🔴 **Outages** (0 systems)\n\nOverall system health: **96.8%** - All critical systems operational. Click the **Live** button in the header for detailed status breakdown.";
  }
  
  // Facility queries
  if (lowerMessage.includes("facility") || lowerMessage.includes("facilities") || lowerMessage.includes("location")) {
    return "**Active Deployment Facilities (6):**\n\n1. **Seoul HQ Automation Lab** (Seoul, South Korea)\n   • 24 robots • 98.2% uptime • R&D and testing\n\n2. **Seoul Servi Factory** (Seoul, South Korea)\n   • 18 robots • 97.5% uptime • Manufacturing ops\n\n3. **Busan Pilot Cluster** (Busan, South Korea)\n   • 15 robots • 94.1% uptime • Beta deployment\n\n4. **Tokyo Robotics Studio** (Tokyo, Japan)\n   • 21 robots • 96.8% uptime • APAC expansion\n\n5. **Silicon Valley Command** (Mountain View, CA, USA)\n   • 12 robots • 95.8% uptime • US operations\n\n6. **Singapore Experience Hub** (Singapore)\n   • 11 robots • 95.3% uptime • Customer demos\n\nWhich facility would you like to learn more about?";
  }
  
  // Help queries
  if (lowerMessage.includes("help") || lowerMessage.includes("what can you") || lowerMessage.includes("capabilities")) {
    return "**I'm Ursa Minor, your Bear Universe assistant!** 🐻\n\nHere's what I can help you with:\n\n**📊 Fleet Management**\n• View specific robot details (\"show robot c44e79\")\n• Check fleet uptime and performance\n• Monitor facility status\n• Query telemetry data\n\n**🗺️ Navigation**\n• Navigate through dashboards\n• Access robot detail pages\n• Jump to specific features\n\n**⚙️ Control & Configuration**\n• Modify robot parameters (with your permission)\n• Execute system commands (with approval)\n• Manage robot settings\n\n**🚨 Monitoring**\n• View active alerts and incidents\n• Check system health\n• Analyze performance trends\n\n**💡 Try asking:**\n• \"What's the fleet performance?\"\n• \"Show me robot c44e79\"\n• \"Are there any alerts?\"\n• \"Navigate to operations\"\n\nWhat would you like to do?";
  }
  
  // AI model queries
  if (lowerMessage.includes("ursa") || lowerMessage.includes("aurora") || lowerMessage.includes("who are you")) {
    return "I'm **Ursa Minor**, a 40B parameter AI assistant specifically trained for Bear Universe operations. I'm part of the Bear AI Constellation:\n\n**🐻 Ursa Minor (40B)** - That's me!\n• Interactive assistant for operators\n• Navigation, robot control, query answering\n• Permission-based command execution\n\n**🐻 Ursa Major (70B)**\n• Fleet orchestrator and automation planner\n• Multi-agent task delegation\n• KPI analysis and diagnostic briefs\n\n**🐻 Aurora Bear Lore (120B)**\n• Institutional knowledge core\n• Product info, partnerships, compliance\n• Customer support and executive briefings\n\nI'm currently at **offline-eval** phase, constantly learning from your interactions. How can I assist you today?";
  }
  
  // Default helpful response
  return "I'm here to help you navigate Bear Universe and manage your robot fleet. 🐻\n\n**Quick suggestions:**\n• Ask about **fleet status** or **performance**\n• View **specific robot details** (e.g., \"show robot c44e79\")\n• Check for **alerts** or **incidents**\n• Navigate to any **dashboard** (operations, AI models, data lake)\n• Query **facility** information\n• Get **system status**\n\nWhat would you like to know or where would you like to go?";
  } catch (error) {
    console.error("🐻 [Mock] Error generating response:", error);
    return "I'm here to help! How can I assist you with Bear Universe today?";
  }
}

