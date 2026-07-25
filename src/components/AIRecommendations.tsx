import * as Icons from "lucide-react";
import { Recommendation } from "../types";
import { motion } from "motion/react";

interface AIRecommendationsProps {
  recommendations: Recommendation[];
}

export default function AIRecommendations({ recommendations }: AIRecommendationsProps) {
  if (recommendations.length === 0) {
    return (
      <div className="bg-blue-50/50 rounded-3xl p-8 border border-blue-100/50 text-center">
        <Icons.Sparkles className="w-8 h-8 text-blue-400 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-gray-900 mb-2">AI Insights Pending</h3>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          Add your Gemini API key in the <strong>Settings &gt; Secrets</strong> panel to unlock personalized weather-based planning recommendations.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Icons.Sparkles className="w-5 h-5 text-blue-600" />
        <h3 className="text-xl font-bold text-gray-900">Intelligence Insights</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {recommendations.map((rec, i) => {
          const IconComponent = (Icons as any)[rec.icon] || Icons.Info;
          
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:border-blue-200 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                <IconComponent className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">{rec.category}</p>
              <p className="text-sm text-gray-600 leading-relaxed font-medium">
                {rec.advice}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
