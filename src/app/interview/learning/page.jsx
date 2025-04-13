"use client";

import { useState } from "react"
import Link from "next/link"
import { 
  Menu, 
  X, 
  Search, 
  Bell, 
  User, 
  ChevronDown,
  BookOpen,
  Award,
  MessageSquare,
  CheckCircle,
  Lightbulb,
  ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"

export function InterviewPrepNavbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-6">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-lg">Interview Prep Hub</span>
          </div>
        </div>
      </div>
    </header>
  );
}


export default function InterviewLearningPage() {
  return (
    <>
      <InterviewPrepNavbar />
      <div className="container mx-auto px-4 py-8">
        {/* Ethics Section */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Interview Ethics</h2>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Understanding Interview Ethics</CardTitle>
              <CardDescription>Learn the ethical principles that guide professional interviews</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Honesty in Representation</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">
                      Always be truthful about your skills, experience, and qualifications. Misrepresentation can lead to:
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Loss of trust if discovered</li>
                      <li>Potential termination if hired under false pretenses</li>
                      <li>Damage to professional reputation</li>
                    </ul>
                    <p className="mt-2">
                      Instead, focus on honestly presenting your strengths and acknowledging areas for growth.
                    </p>
                  </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Professional Conduct</AccordionTrigger>
                <AccordionContent>
                  <p>Maintain professionalism throughout the interview process:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Arrive on time (or join virtual meetings promptly)</li>
                    <li>Dress appropriately for the company culture</li>
                    <li>Communicate respectfully with all staff members</li>
                    <li>Follow up with thank-you notes</li>
                    <li>Respond to communications in a timely manner</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>Handling Inappropriate Questions</AccordionTrigger>
                <AccordionContent>
                  <p>If faced with potentially discriminatory or inappropriate questions:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Recognize questions that may violate employment laws</li>
                    <li>Consider the intent behind the question</li>
                    <li>Redirect to relevant professional qualifications</li>
                    <li>Politely decline to answer if necessary</li>
                  </ul>
                  <p className="mt-2">
                    Example response: "I'd be happy to discuss my professional qualifications that relate to this
                    position."
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </section>

      {/* Confidence Building Section */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <Award className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold">Building Interview Confidence</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Mental Preparation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Positive Visualization</h4>
                  <p className="text-muted-foreground">
                    Regularly visualize yourself succeeding in the interview, answering questions confidently and making
                    a good impression.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Affirmations</h4>
                  <p className="text-muted-foreground">
                    Practice positive self-talk: "I am well-prepared," "I have valuable skills to offer," "I am the
                    right person for this role."
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Reframe Nervousness</h4>
                  <p className="text-muted-foreground">
                    Interpret nervous energy as excitement and enthusiasm for the opportunity rather than anxiety.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Practical Preparation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Mock Interviews</h4>
                  <p className="text-muted-foreground">
                    Practice with friends, mentors, or career counselors to receive feedback and get comfortable with
                    the interview format.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Record Yourself</h4>
                  <p className="text-muted-foreground">
                    Record practice interviews to identify areas for improvement in your communication style, body
                    language, and responses.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Research Thoroughly</h4>
                  <p className="text-muted-foreground">
                    Confidence comes from knowledge. Research the company, role, and industry to speak knowledgeably
                    during the interview.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Confidence Boosting Techniques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-muted rounded-lg p-4">
                  <h4 className="font-medium mb-2">Power Posing</h4>
                  <p className="text-sm text-muted-foreground">
                    Stand in a confident posture for 2 minutes before your interview to increase confidence hormones.
                  </p>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <h4 className="font-medium mb-2">Deep Breathing</h4>
                  <p className="text-sm text-muted-foreground">
                    Practice 4-7-8 breathing: inhale for 4 seconds, hold for 7, exhale for 8 to calm nerves.
                  </p>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <h4 className="font-medium mb-2">Memory Anchoring</h4>
                  <p className="text-sm text-muted-foreground">
                    Recall a time when you felt extremely capable and successful to boost your confidence.
                  </p>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <h4 className="font-medium mb-2">Preparation Ritual</h4>
                  <p className="text-sm text-muted-foreground">
                    Develop a pre-interview routine that helps you feel centered and ready.
                  </p>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <h4 className="font-medium mb-2">Dress Confidently</h4>
                  <p className="text-sm text-muted-foreground">
                    Wear professional attire that makes you feel comfortable and confident.
                  </p>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <h4 className="font-medium mb-2">Arrive Early</h4>
                  <p className="text-sm text-muted-foreground">
                    Give yourself extra time to avoid rushing and to mentally prepare in a calm state.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Famous Questions Section */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold">Famous Interview Questions</h2>
        </div>
        <Tabs defaultValue="behavioral">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="behavioral">Behavioral</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
            <TabsTrigger value="situational">Situational</TabsTrigger>
          </TabsList>
          <TabsContent value="behavioral" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Behavioral Questions</CardTitle>
                <CardDescription>
                  Questions that assess past behavior as an indicator of future performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="b1">
                    <AccordionTrigger>Tell me about yourself</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <p>
                          <strong>Why they ask this:</strong> This open-ended question tests your ability to summarize
                          your background and highlight relevant experiences.
                        </p>
                        <p>
                          <strong>How to answer:</strong> Structure your response with a brief overview of your
                          professional background, relevant skills, and why you're interested in this role. Keep it
                          concise (1-2 minutes) and focused on professional rather than personal details.
                        </p>
                        <p>
                          <strong>Example:</strong> "I'm a software developer with 5 years of experience specializing in
                          full-stack web development. I started my career at [Company], where I developed [specific
                          skills]. Most recently at [Current Company], I led a team that [accomplishment]. I'm
                          particularly interested in this role because [specific reason related to the position]."
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="b2">
                    <AccordionTrigger>What is your greatest strength?</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <p>
                          <strong>Why they ask this:</strong> Interviewers want to know if your strengths align with the
                          job requirements.
                        </p>
                        <p>
                          <strong>How to answer:</strong> Choose a strength that's relevant to the position, provide
                          evidence of this strength, and explain how it would benefit the company.
                        </p>
                        <p>
                          <strong>Example:</strong> "My greatest strength is my ability to solve complex problems. For
                          example, at my previous job, I identified a bottleneck in our workflow that was causing
                          delays. I analyzed the process, collaborated with team members, and implemented a solution
                          that reduced processing time by 30%. This skill would be valuable in this role as you
                          mentioned the need for process optimization."
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="b3">
                    <AccordionTrigger>Describe a challenge you faced at work and how you overcame it</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <p>
                          <strong>Why they ask this:</strong> This question assesses your problem-solving abilities and
                          resilience.
                        </p>
                        <p>
                          <strong>How to answer:</strong> Use the STAR method (Situation, Task, Action, Result) to
                          structure your response. Choose a genuine challenge that demonstrates valuable skills.
                        </p>
                        <p>
                          <strong>Example:</strong> "At my previous company, we lost a major client that accounted for
                          30% of our revenue (Situation). I was tasked with finding new business to fill this gap within
                          a quarter (Task). I developed a targeted outreach strategy, identified 50 potential clients,
                          and personally led presentations to the top 10 prospects (Action). Within three months, we
                          secured two new clients that replaced 80% of the lost revenue, and within six months, we had
                          exceeded our previous revenue levels (Result)."
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="b4">
                    <AccordionTrigger>Why are you leaving your current job?</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <p>
                          <strong>Why they ask this:</strong> Interviewers want to understand your motivations and
                          ensure you're not leaving due to performance issues or conflicts.
                        </p>
                        <p>
                          <strong>How to answer:</strong> Be honest but positive. Focus on what you're moving toward
                          rather than what you're leaving behind. Avoid speaking negatively about your current employer.
                        </p>
                        <p>
                          <strong>Example:</strong> "I've learned a lot in my current role and value the experience I've
                          gained there. However, I'm looking for new challenges and growth opportunities that align with
                          my career goals. Your company's focus on [specific aspect] and the chance to work on [specific
                          projects/technologies] is exactly the kind of opportunity I'm seeking to advance my career."
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="b5">
                    <AccordionTrigger>Where do you see yourself in five years?</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <p>
                          <strong>Why they ask this:</strong> This question helps employers understand your career
                          ambitions and whether the position aligns with your long-term goals.
                        </p>
                        <p>
                          <strong>How to answer:</strong> Show ambition while being realistic. Demonstrate that you've
                          thought about your career path and how this role fits into it.
                        </p>
                        <p>
                          <strong>Example:</strong> "In five years, I hope to have developed deep expertise in [relevant
                          area] and taken on increasing responsibility, perhaps in a senior or leadership role. I'm
                          particularly interested in developing my skills in [specific area relevant to the company],
                          and I see this position as an excellent stepping stone toward that goal. I'm excited about the
                          growth opportunities at [Company] and how they align with my professional development plans."
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="technical" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Technical Questions</CardTitle>
                <CardDescription>
                  Questions that assess your technical knowledge and problem-solving abilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="t1">
                    <AccordionTrigger>Explain the difference between REST and GraphQL</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <p>
                          <strong>Key points to cover:</strong>
                        </p>
                        <ul className="list-disc pl-6 space-y-1">
                          <li>
                            REST uses multiple endpoints for different resources, while GraphQL typically uses a single
                            endpoint
                          </li>
                          <li>
                            REST often results in over-fetching or under-fetching data, while GraphQL allows clients to
                            request exactly what they need
                          </li>
                          <li>
                            REST is more cache-friendly by default, while GraphQL requires additional caching strategies
                          </li>
                          <li>REST follows a resource-oriented approach, while GraphQL is query-oriented</li>
                        </ul>
                        <p>
                          <strong>Pro tip:</strong> Mention real-world scenarios where you would choose one over the
                          other to demonstrate practical understanding.
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="t2">
                    <AccordionTrigger>How would you optimize a website's performance?</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <p>
                          <strong>Key areas to address:</strong>
                        </p>
                        <ul className="list-disc pl-6 space-y-1">
                          <li>
                            Frontend optimizations: Image optimization, code splitting, lazy loading, minification
                          </li>
                          <li>Backend optimizations: Database indexing, caching strategies, efficient queries</li>
                          <li>Network optimizations: CDN usage, HTTP/2 or HTTP/3, compression</li>
                          <li>
                            Monitoring and measurement: Using tools like Lighthouse, WebPageTest, or Chrome DevTools
                          </li>
                        </ul>
                        <p>
                          <strong>Pro tip:</strong> Describe a specific performance issue you've solved in the past and
                          the measurable improvements you achieved.
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="t3">
                    <AccordionTrigger>Explain the concept of Big O notation</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <p>
                          <strong>Key points to cover:</strong>
                        </p>
                        <ul className="list-disc pl-6 space-y-1">
                          <li>Big O notation describes the performance or complexity of an algorithm</li>
                          <li>It specifically describes the worst-case scenario</li>
                          <li>
                            Common complexities: O(1) constant, O(log n) logarithmic, O(n) linear, O(n log n), O(n²)
                            quadratic, O(2ⁿ) exponential
                          </li>
                          <li>Examples of algorithms and their Big O notation (e.g., binary search is O(log n))</li>
                        </ul>
                        <p>
                          <strong>Pro tip:</strong> Provide a real-world example where you chose one algorithm over
                          another based on Big O considerations.
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="t4">
                    <AccordionTrigger>What is dependency injection and why is it useful?</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <p>
                          <strong>Key points to cover:</strong>
                        </p>
                        <ul className="list-disc pl-6 space-y-1">
                          <li>
                            Dependency injection is a design pattern where objects receive their dependencies rather
                            than creating them
                          </li>
                          <li>Benefits include improved testability, modularity, and flexibility</li>
                          <li>
                            Types of dependency injection: constructor injection, setter injection, interface injection
                          </li>
                          <li>Examples of DI frameworks in different languages/ecosystems</li>
                        </ul>
                        <p>
                          <strong>Pro tip:</strong> Provide a simple code example showing before and after implementing
                          dependency injection to demonstrate the concept clearly.
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="t5">
                    <AccordionTrigger>Describe the process of deploying a web application</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <p>
                          <strong>Key steps to mention:</strong>
                        </p>
                        <ul className="list-disc pl-6 space-y-1">
                          <li>Version control: Committing code to a repository (Git)</li>
                          <li>CI/CD pipeline: Automated testing, building, and deployment</li>
                          <li>Environment configuration: Managing environment variables and secrets</li>
                          <li>Deployment strategies: Blue-green deployment, canary releases, rolling updates</li>
                          <li>Monitoring and rollback procedures</li>
                        </ul>
                        <p>
                          <strong>Pro tip:</strong> Mention specific tools you've used in each step (e.g., GitHub
                          Actions, Jenkins, Docker, Kubernetes, AWS/Azure/GCP services).
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="situational" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Situational Questions</CardTitle>
                <CardDescription>Questions that assess how you would handle hypothetical scenarios</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="s1">
                    <AccordionTrigger>How would you handle a disagreement with a team member?</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <p>
                          <strong>Key principles to address:</strong>
                        </p>
                        <ul className="list-disc pl-6 space-y-1">
                          <li>Focus on active listening and understanding their perspective</li>
                          <li>Emphasize private, direct communication rather than public confrontation</li>
                          <li>Concentrate on the issue, not the person</li>
                          <li>Seek common ground and compromise where possible</li>
                          <li>Involve a mediator (like a manager) only if necessary</li>
                        </ul>
                        <p>
                          <strong>Example response:</strong> "I believe in addressing conflicts directly but
                          respectfully. I would first request a private conversation with my colleague to understand
                          their perspective fully. I'd clearly articulate my viewpoint while focusing on the issue
                          rather than making it personal. My goal would be to find common ground and a solution that
                          works for both of us and benefits the project. If we couldn't resolve it ourselves, I would
                          then consider involving a team lead or manager for mediation."
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="s2">
                    <AccordionTrigger>
                      What would you do if you were assigned a project with an unrealistic deadline?
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <p>
                          <strong>Key steps to mention:</strong>
                        </p>
                        <ul className="list-disc pl-6 space-y-1">
                          <li>Assess the requirements and create a realistic timeline</li>
                          <li>Communicate concerns constructively with data and alternatives</li>
                          <li>Propose solutions (additional resources, scope adjustment, phased delivery)</li>
                          <li>If the deadline cannot be changed, prioritize critical features</li>
                          <li>Keep stakeholders informed of progress and challenges</li>
                        </ul>
                        <p>
                          <strong>Example response:</strong> "I would first thoroughly analyze the project requirements
                          to determine a realistic timeline. If I found the deadline unrealistic, I would prepare data
                          showing why and schedule a meeting with my manager. Rather than just highlighting the problem,
                          I'd come with solutions like prioritizing features for a phased release, identifying areas
                          where we could add resources, or suggesting scope adjustments. Throughout the project, I'd
                          maintain transparent communication about progress and challenges to avoid surprises."
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="s3">
                    <AccordionTrigger>
                      How would you handle a situation where requirements keep changing?
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <p>
                          <strong>Key approaches to mention:</strong>
                        </p>
                        <ul className="list-disc pl-6 space-y-1">
                          <li>Implement an agile or iterative approach to accommodate changes</li>
                          <li>Establish a formal change request process</li>
                          <li>Document all changes and their impact on timeline/resources</li>
                          <li>Communicate the effects of changes to stakeholders</li>
                          <li>Suggest prioritization of changes based on value and effort</li>
                        </ul>
                        <p>
                          <strong>Example response:</strong> "I understand that requirements can evolve, especially in
                          dynamic projects. I would implement an agile approach with regular check-ins to accommodate
                          changes more smoothly. For each change, I would document the impact on timeline, resources,
                          and other features. I'd work with stakeholders to prioritize changes based on business value
                          versus implementation effort. Most importantly, I'd ensure we have a formal change request
                          process that includes impact assessment before approval, so everyone understands the
                          trade-offs involved."
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="s4">
                    <AccordionTrigger>
                      What would you do if you noticed a colleague was struggling with their workload?
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <p>
                          <strong>Key approaches to mention:</strong>
                        </p>
                        <ul className="list-disc pl-6 space-y-1">
                          <li>Approach them privately to offer support</li>
                          <li>Share relevant knowledge or resources that might help</li>
                          <li>Offer direct assistance if your workload permits</li>
                          <li>Suggest team-based solutions without undermining their position</li>
                          <li>Consider mentioning the situation to a manager if appropriate</li>
                        </ul>
                        <p>
                          <strong>Example response:</strong> "I would first approach my colleague privately to check in
                          and see if they're okay. If they confirm they're struggling, I'd offer to share any knowledge
                          or resources that might help them. If my own workload permitted, I'd offer direct assistance
                          with specific tasks. For a more sustainable solution, I might suggest to our team lead that we
                          redistribute some work or implement pair programming temporarily, framing it as a team
                          optimization rather than highlighting my colleague's difficulties."
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="s5">
                    <AccordionTrigger>How would you prioritize tasks when everything seems urgent?</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <p>
                          <strong>Key strategies to mention:</strong>
                        </p>
                        <ul className="list-disc pl-6 space-y-1">
                          <li>Distinguish between urgent and important using frameworks like the Eisenhower Matrix</li>
                          <li>Consider business impact and dependencies between tasks</li>
                          <li>Communicate with stakeholders to align on true priorities</li>
                          <li>Break down large tasks into smaller, manageable pieces</li>
                          <li>Regularly reassess priorities as situations evolve</li>
                        </ul>
                        <p>
                          <strong>Example response:</strong> "When facing multiple urgent tasks, I first distinguish
                          between what's truly urgent versus important using the Eisenhower Matrix. I assess each task's
                          business impact and identify any dependencies that might affect the sequence. I would
                          communicate with stakeholders to ensure alignment on priorities and manage expectations. For
                          complex tasks, I break them down into smaller components that can be tackled incrementally.
                          Throughout this process, I maintain a flexible approach, reassessing priorities as new
                          information emerges or circumstances change."
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      {/* Personalized Preparation Section */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold">Personalized Question Preparation</h2>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Prepare Based on Your Profile</CardTitle>
            <CardDescription>
              Customize your interview preparation based on your experience level and skills
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="entry">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="entry">Entry Level</TabsTrigger>
                <TabsTrigger value="mid">Mid Level</TabsTrigger>
                <TabsTrigger value="senior">Senior Level</TabsTrigger>
              </TabsList>
              <TabsContent value="entry" className="mt-4">
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="bg-muted rounded-lg p-4">
                      <h3 className="font-medium mb-2">Technical Fundamentals</h3>
                      <ul className="list-disc pl-6 space-y-1 text-sm">
                        <li>Expect questions on basic concepts in your field</li>
                        <li>Be prepared to discuss your academic projects in detail</li>
                        <li>Review fundamentals from your coursework or training</li>
                      </ul>
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                      <h3 className="font-medium mb-2">Behavioral Focus</h3>
                      <ul className="list-disc pl-6 space-y-1 text-sm">
                        <li>Highlight transferable skills from internships, projects, or part-time work</li>
                        <li>Prepare examples of teamwork and problem-solving</li>
                        <li>Demonstrate eagerness to learn and grow</li>
                      </ul>
                    </div>
                  </div>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Sample Entry-Level Questions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="p-3 bg-muted/50 rounded-md">
                          <p className="font-medium">
                            What relevant coursework have you completed that prepares you for this role?
                          </p>
                        </li>
                        <li className="p-3 bg-muted/50 rounded-md">
                          <p className="font-medium">How do you approach learning new technologies or skills?</p>
                        </li>
                        <li className="p-3 bg-muted/50 rounded-md">
                          <p className="font-medium">
                            Tell me about a project you worked on and what your contribution was.
                          </p>
                        </li>
                        <li className="p-3 bg-muted/50 rounded-md">
                          <p className="font-medium">
                            How do you prioritize your work when you have multiple assignments?
                          </p>
                        </li>
                        <li className="p-3 bg-muted/50 rounded-md">
                          <p className="font-medium">
                            What are your career goals and how does this position fit into them?
                          </p>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="mid" className="mt-4">
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="bg-muted rounded-lg p-4">
                      <h3 className="font-medium mb-2">Technical Depth</h3>
                      <ul className="list-disc pl-6 space-y-1 text-sm">
                        <li>Prepare for deeper technical questions in your specialty</li>
                        <li>Be ready to discuss specific projects and your technical contributions</li>
                        <li>Expect questions about your problem-solving approach</li>
                      </ul>
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                      <h3 className="font-medium mb-2">Experience Focus</h3>
                      <ul className="list-disc pl-6 space-y-1 text-sm">
                        <li>Highlight measurable achievements from previous roles</li>
                        <li>Prepare examples of how you've grown professionally</li>
                        <li>Discuss how you've handled challenges or conflicts</li>
                      </ul>
                    </div>
                  </div>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Sample Mid-Level Questions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="p-3 bg-muted/50 rounded-md">
                          <p className="font-medium">
                            Describe a complex problem you solved and your approach to solving it.
                          </p>
                        </li>
                        <li className="p-3 bg-muted/50 rounded-md">
                          <p className="font-medium">
                            How have you improved processes or efficiency in your previous roles?
                          </p>
                        </li>
                        <li className="p-3 bg-muted/50 rounded-md">
                          <p className="font-medium">
                            Tell me about a time when you had to learn a new technology quickly.
                          </p>
                        </li>
                        <li className="p-3 bg-muted/50 rounded-md">
                          <p className="font-medium">How do you balance quality and meeting deadlines in your work?</p>
                        </li>
                        <li className="p-3 bg-muted/50 rounded-md">
                          <p className="font-medium">
                            Describe a situation where you had to influence others without direct authority.
                          </p>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="senior" className="mt-4">
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="bg-muted rounded-lg p-4">
                      <h3 className="font-medium mb-2">Strategic Thinking</h3>
                      <ul className="list-disc pl-6 space-y-1 text-sm">
                        <li>Prepare to discuss high-level decision making and trade-offs</li>
                        <li>Be ready to explain how you align technical decisions with business goals</li>
                        <li>Expect questions about system design and architecture</li>
                      </ul>
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                      <h3 className="font-medium mb-2">Leadership Focus</h3>
                      <ul className="list-disc pl-6 space-y-1 text-sm">
                        <li>Highlight examples of mentoring and developing team members</li>
                        <li>Prepare stories about leading projects or initiatives</li>
                        <li>Discuss how you've handled difficult team situations</li>
                      </ul>
                    </div>
                  </div>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Sample Senior-Level Questions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="p-3 bg-muted/50 rounded-md">
                          <p className="font-medium">
                            How do you approach making architectural decisions with long-term implications?
                          </p>
                        </li>
                        <li className="p-3 bg-muted/50 rounded-md">
                          <p className="font-medium">
                            Tell me about a time when you had to make a difficult decision that impacted your team.
                          </p>
                        </li>
                        <li className="p-3 bg-muted/50 rounded-md">
                          <p className="font-medium">How have you handled disagreements with senior stakeholders?</p>
                        </li>
                        <li className="p-3 bg-muted/50 rounded-md">
                          <p className="font-medium">
                            Describe how you've mentored or developed more junior team members.
                          </p>
                        </li>
                        <li className="p-3 bg-muted/50 rounded-md">
                          <p className="font-medium">
                            How do you balance technical debt against delivering new features?
                          </p>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </section>

      {/* Skills-Based Questions Section */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold">Skills-Based Questions</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>
                <div className="flex items-center gap-2">
                  <Badge>Programming</Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">Common questions for programming roles</p>
              <ul className="space-y-2">
                <li className="text-sm p-2 bg-muted/50 rounded-md">How do you approach debugging a complex issue?</li>
                <li className="text-sm p-2 bg-muted/50 rounded-md">Explain your process for code reviews.</li>
                <li className="text-sm p-2 bg-muted/50 rounded-md">How do you ensure your code is maintainable?</li>
                <li className="text-sm p-2 bg-muted/50 rounded-md">
                  Describe your experience with test-driven development.
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                <Link href="#" className="flex items-center justify-center w-full">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>
                <div className="flex items-center gap-2">
                  <Badge>Project Management</Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">Common questions for project management roles</p>
              <ul className="space-y-2">
                <li className="text-sm p-2 bg-muted/50 rounded-md">How do you handle scope creep?</li>
                <li className="text-sm p-2 bg-muted/50 rounded-md">Describe your approach to risk management.</li>
                <li className="text-sm p-2 bg-muted/50 rounded-md">How do you prioritize tasks in a project?</li>
                <li className="text-sm p-2 bg-muted/50 rounded-md">
                  Tell me about a project that failed and what you learned.
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                <Link href="#" className="flex items-center justify-center w-full">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>
                <div className="flex items-center gap-2">
                  <Badge>Data Analysis</Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">Common questions for data analysis roles</p>
              <ul className="space-y-2">
                <li className="text-sm p-2 bg-muted/50 rounded-md">How do you ensure data quality in your analysis?</li>
                <li className="text-sm p-2 bg-muted/50 rounded-md">Describe a complex data problem you solved.</li>
                <li className="text-sm p-2 bg-muted/50 rounded-md">
                  How do you communicate technical findings to non-technical stakeholders?
                </li>
                <li className="text-sm p-2 bg-muted/50 rounded-md">What tools do you use for data visualization?</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                <Link href="#" className="flex items-center justify-center w-full">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>
                <div className="flex items-center gap-2">
                  <Badge>UX/UI Design</Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">Common questions for design roles</p>
              <ul className="space-y-2">
                <li className="text-sm p-2 bg-muted/50 rounded-md">How do you approach user research?</li>
                <li className="text-sm p-2 bg-muted/50 rounded-md">
                  Describe your design process from concept to delivery.
                </li>
                <li className="text-sm p-2 bg-muted/50 rounded-md">
                  How do you incorporate accessibility in your designs?
                </li>
                <li className="text-sm p-2 bg-muted/50 rounded-md">
                  Tell me about a design challenge you faced and how you solved it.
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                <Link href="#" className="flex items-center justify-center w-full">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>
                <div className="flex items-center gap-2">
                  <Badge>Marketing</Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">Common questions for marketing roles</p>
              <ul className="space-y-2">
                <li className="text-sm p-2 bg-muted/50 rounded-md">
                  How do you measure the success of a marketing campaign?
                </li>
                <li className="text-sm p-2 bg-muted/50 rounded-md">Describe a successful campaign you managed.</li>
                <li className="text-sm p-2 bg-muted/50 rounded-md">How do you stay updated with marketing trends?</li>
                <li className="text-sm p-2 bg-muted/50 rounded-md">
                  How would you approach marketing to a new demographic?
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                <Link href="#" className="flex items-center justify-center w-full">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>
                <div className="flex items-center gap-2">
                  <Badge>Leadership</Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">Common questions for leadership roles</p>
              <ul className="space-y-2">
                <li className="text-sm p-2 bg-muted/50 rounded-md">
                  How do you motivate your team during challenging times?
                </li>
                <li className="text-sm p-2 bg-muted/50 rounded-md">Describe your leadership style.</li>
                <li className="text-sm p-2 bg-muted/50 rounded-md">How do you handle underperforming team members?</li>
                <li className="text-sm p-2 bg-muted/50 rounded-md">
                  Tell me about a time you had to make an unpopular decision.
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                <Link href="#" className="flex items-center justify-center w-full">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Suggestions Section */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold">Interview Suggestions</h2>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Expert Tips for Interview Success</CardTitle>
            <CardDescription>Practical advice to help you stand out in your next interview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Before the Interview</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Research thoroughly</p>
                      <p className="text-sm text-muted-foreground">
                        Study the company's products, culture, recent news, and the specific team you're applying to
                        join.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Prepare your stories</p>
                      <p className="text-sm text-muted-foreground">
                        Develop concise, structured examples of your achievements using the STAR method (Situation,
                        Task, Action, Result).
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Practice with mock interviews</p>
                      <p className="text-sm text-muted-foreground">
                        Conduct practice interviews with friends or mentors to receive feedback on your responses and
                        delivery.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Prepare thoughtful questions</p>
                      <p className="text-sm text-muted-foreground">
                        Develop insightful questions that demonstrate your interest in the role and company.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="font-medium text-lg">During the Interview</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Listen actively</p>
                      <p className="text-sm text-muted-foreground">
                        Pay close attention to questions and don't hesitate to ask for clarification if needed.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Be concise but thorough</p>
                      <p className="text-sm text-muted-foreground">
                        Structure your answers to be comprehensive without rambling. Aim for 1-2 minute responses.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Show enthusiasm</p>
                      <p className="text-sm text-muted-foreground">
                        Demonstrate genuine interest in the role and company through your energy and engagement.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Connect your experience to the role</p>
                      <p className="text-sm text-muted-foreground">
                        Explicitly link your past achievements to how they would benefit the company in this position.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-medium text-lg mb-4">After the Interview</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Send a Thank-You Note</h4>
                  <p className="text-sm text-muted-foreground">
                    Send a personalized thank-you email within 24 hours, referencing specific conversation points.
                  </p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Reflect and Improve</h4>
                  <p className="text-sm text-muted-foreground">
                    Note what went well and areas for improvement while the interview is fresh in your mind.
                  </p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Follow Up Appropriately</h4>
                  <p className="text-sm text-muted-foreground">
                    If you don't hear back within the expected timeframe, send a polite follow-up inquiry.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold">Get Personalized Guidance</h2>
        </div>
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="grid gap-6 md:grid-cols-2 items-center">
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Need more specific help?</h3>
                <p>
                  Our career coaches can provide personalized interview preparation tailored to your specific industry,
                  role, and experience level.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button>Book a Session</Button>
                  <Button variant="outline">Join Practice Group</Button>
                </div>
              </div>
              <div className="bg-background p-6 rounded-lg">
                <h4 className="font-medium mb-3">Our services include:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">One-on-one mock interviews</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Resume and portfolio reviews</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Industry-specific preparation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Salary negotiation coaching</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Post-interview feedback and analysis</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
    </>
  )
}
