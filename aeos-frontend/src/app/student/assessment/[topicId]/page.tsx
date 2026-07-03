import { createClient } from "@/lib/supabase/server";
import { AssessmentEngine } from "@/components/student/assessment-engine";
import { redirect } from "next/navigation";

export default async function AssessmentPage({ params }: { params: Promise<{ topicId: string }> }) {
  const resolvedParams = await params;
  const { topicId } = resolvedParams;
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch actual questions if db is populated, otherwise gracefully fallback to mock
  const { data: questions } = await supabase
    .from("questions")
    .select("*")
    .limit(5);

  const activeQuestions = questions && questions.length > 0 ? questions : [
    { 
      id: "q1", 
      content: "If a localized quantum fluctuation induces a temporary mass shift in a 2kg object, dropping its apparent weight by 20% in standard gravity, what is its new apparent weight in Newtons?", 
      correct_answer: "B", 
      options: [{id: "A", text: "19.6 N"}, {id: "B", text: "15.68 N"}, {id: "C", text: "17.4 N"}, {id: "D", text: "14.2 N"}] 
    },
    { 
      id: "q2", 
      content: "A neural pathway forms 10^3 connections per second. How many connections form in exactly 2.5 minutes?", 
      correct_answer: "C", 
      options: [{id: "A", text: "2.5 * 10^4"}, {id: "B", text: "1.5 * 10^4"}, {id: "C", text: "1.5 * 10^5"}, {id: "D", text: "2.5 * 10^5"}] 
    },
    { 
      id: "q3", 
      content: "In algorithmic space complexity, if an array requires O(N) space and a recursive stack requires O(log N) space, what is the dominating space term for large N?", 
      correct_answer: "A", 
      options: [{id: "A", text: "O(N)"}, {id: "B", text: "O(log N)"}, {id: "C", text: "O(N log N)"}, {id: "D", text: "O(1)"}] 
    }
  ];

  // Mocking assessment ID for scaffolding Phase 4
  const assessmentId = "00000000-0000-0000-0000-000000000000";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090b] relative z-20">
      <AssessmentEngine 
        questions={activeQuestions} 
        topicId={topicId} 
        studentId={user.id} 
        assessmentId={assessmentId}
      />
    </div>
  );
}
