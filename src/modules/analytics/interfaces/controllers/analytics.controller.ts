
import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { MessageAnalyticModel } from "@/modules/analytics/infrastructure/persistence/mongoose/models/message-analytic.model";
import { ToolCallAnalyticModel } from "@/modules/analytics/infrastructure/persistence/mongoose/models/tool-call-analytic.model";

async function getIntentAnalyticsHandler(req: NextRequest) {
  try {
    const { isAuthenticated } = await verifySession();
    if (!isAuthenticated) {
      return NextResponse.json({ message: "Authentication required" }, { status: 401 });
    }

    await dbConnect();
    const data = await MessageAnalyticModel.aggregate([
      { $group: { _id: "$intent", count: { $sum: 1 } } },
      { $project: { intent: "$_id", count: 1, _id: 0 } },
    ]);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

async function getSentimentAnalyticsHandler(req: NextRequest) {
  try {
    const { isAuthenticated } = await verifySession();
    if (!isAuthenticated) {
      return NextResponse.json({ message: "Authentication required" }, { status: 401 });
    }

    await dbConnect();
    const [sentimentData, urgencyData, interactionTypeData] = await Promise.all([
      MessageAnalyticModel.aggregate([
        { $group: { _id: "$sentiment", count: { $sum: 1 } } },
        { $project: { sentiment: "$_id", count: 1, _id: 0 } },
      ]),
      MessageAnalyticModel.aggregate([
        { $group: { _id: "$urgency", count: { $sum: 1 } } },
        { $project: { urgency: "$_id", count: 1, _id: 0 } },
      ]),
      MessageAnalyticModel.aggregate([
        { $group: { _id: "$interactionType", count: { $sum: 1 } } },
        { $project: { interactionType: "$_id", count: 1, _id: 0 } },
      ]),
    ]);

    return NextResponse.json({ sentimentData, urgencyData, interactionTypeData });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

async function getToolPerformanceAnalyticsHandler(req: NextRequest) {
  try {
    const { isAuthenticated } = await verifySession();
    if (!isAuthenticated) {
      return NextResponse.json({ message: "Authentication required" }, { status: 401 });
    }

    await dbConnect();
    const data = await ToolCallAnalyticModel.aggregate([
      {
        $group: {
          _id: "$toolName",
          totalCalls: { $sum: 1 },
          successfulCalls: {
            $sum: { $cond: ["$wasSuccessful", 1, 0] },
          },
        },
      },
      {
        $project: {
          _id: 1,
          totalCalls: 1,
          successfulCalls: 1,
          failedCalls: { $subtract: ["$totalCalls", "$successfulCalls"] },
          successRate: {
            $cond: [
              { $eq: ["$totalCalls", 0] },
              0,
              { $multiply: [{ $divide: ["$successfulCalls", "$totalCalls"] }, 100] },
            ],
          },
        },
      },
    ]);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export const analyticsController = {
    getIntentAnalyticsHandler,
    getSentimentAnalyticsHandler,
    getToolPerformanceAnalyticsHandler,
};
