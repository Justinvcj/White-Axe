# White Axe (AEOS) - Adaptive Educational Operating System

🌍 **Live Demo:** [https://white-axe.vercel.app/](https://white-axe.vercel.app/)

## ⚠️ The Problem: "One-Size-Fits-All" Education is Broken
1. **Static Assessments:** Every student takes the exact same test, regardless of whether they learn best through sports, technology, or literature. If a student doesn't care about the context of a physics question, they disengage.
2. **Subjective Categorization:** Teachers are forced to manually categorize students (Advanced, Average, Needs Help) based on limited bandwidth and human intuition, which can accidentally introduce bias or overlook hidden potential.
3. **Teacher Burnout:** A teacher simply does not have the time to sit down and rewrite 30 different personalized quizzes for 30 different students every single day. 

## 💡 The Solution: An AI-Driven Co-Pilot for the Classroom
**White Axe (AEOS)** is an intelligent, hyper-adaptive Educational Operating System designed to augment teachers, not replace them. We built a platform where AI seamlessly handles the heavy lifting of personalization, allowing teachers to focus on human connection.

### How it Works (The Core Loop):
1. **The Teacher's Hypothesis:** The teacher observes a student and logs a baseline hypothesis (e.g., "I think Emma is currently at a C3/Needs Help level in Physics"). 
2. **Interest-Driven Contextualization:** The teacher notes that Emma loves *Cricket*.
3. **The Adaptive Challenge Arena:** When Emma logs in to take her physics assessment, the AI instantly rewrites the entire test to teach physics through the lens of Cricket *(e.g., "A 150g cricket ball is bowled at 40 m/s...")*. 
4. **The AI Comparison Engine:** Once the student finishes, our AI Engine calculates their true mastery score. It then actively compares the **Teacher's Hypothesis** against the **AI's Evaluation** to generate an unbiased, highly accurate **Optimal Final Tier** for the student.

By merging human intuition with machine-speed personalization, we ensure no student is left behind, and no teacher is left overwhelmed.

---

## 🛠 Tech Stack
- **Frontend & Backend Framework:** Next.js (App Router, React 18)
- **Styling:** Tailwind CSS + Framer Motion (for fluid micro-animations)
- **Database & Auth:** Supabase (PostgreSQL with strict Row Level Security)
- **Deployment:** Vercel

## 🚀 Running Locally
1. Clone the repository and navigate into the frontend folder:
   ```bash
   cd aeos-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your `.env.local` file with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
