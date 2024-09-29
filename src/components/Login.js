// import React, { useState } from "react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";

// export default function LoginPage() {
//   const [isSignIn, setIsSignIn] = useState(true);
//   const [activeTab, setActiveTab] = useState("customer");

//   const toggleForm = () => setIsSignIn(!isSignIn);

//   return (
//     <div className="flex h-screen">
//       {/* Left side */}
//       <div
//         className="w-1/2 bg-cover bg-center relative"
//         style={{
//           backgroundImage: "url('/placeholder.svg?height=1080&width=1080')",
//         }}
//       >
//         <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <Tabs
//             value={activeTab}
//             onValueChange={setActiveTab}
//             className="w-2/3"
//           >
//             <TabsList className="grid w-full grid-cols-2">
//               <TabsTrigger value="agent">Agent</TabsTrigger>
//               <TabsTrigger value="customer">Customer</TabsTrigger>
//             </TabsList>
//             <TabsContent value="agent" className="text-white text-center">
//               <h2 className="text-2xl font-bold mb-4">Agent Portal</h2>
//               <p>
//                 Access agent-specific features and manage customer requests.
//               </p>
//             </TabsContent>
//             <TabsContent value="customer" className="text-white text-center">
//               <h2 className="text-2xl font-bold mb-4">Customer Portal</h2>
//               <p>Manage your account, track orders, and get support.</p>
//             </TabsContent>
//           </Tabs>
//         </div>
//       </div>

//       {/* Right side */}
//       <div className="w-1/2 bg-orange-50 flex items-center justify-center">
//         <div className="w-2/3 max-w-md">
//           <h1 className="text-3xl font-bold mb-6 text-center text-orange-800">
//             {isSignIn ? "Sign In" : "Sign Up"}
//           </h1>
//           <form className="space-y-4">
//             {!isSignIn && (
//               <>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="firstName">First Name</Label>
//                     <Input id="firstName" placeholder="John" />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="lastName">Last Name</Label>
//                     <Input id="lastName" placeholder="Doe" />
//                   </div>
//                 </div>
//               </>
//             )}
//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input id="email" type="email" placeholder="john@example.com" />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="password">Password</Label>
//               <Input id="password" type="password" />
//             </div>
//             {!isSignIn && (
//               <>
//                 <div className="space-y-2">
//                   <Label htmlFor="confirmPassword">Confirm Password</Label>
//                   <Input id="confirmPassword" type="password" />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="pinCode">Pin Code</Label>
//                   <Input id="pinCode" placeholder="123456" />
//                 </div>
//               </>
//             )}
//             <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
//               {isSignIn ? "Sign In" : "Sign Up"}
//             </Button>
//           </form>
//           <p className="mt-4 text-center text-sm">
//             {isSignIn ? "Don't have an account? " : "Already have an account? "}
//             <button
//               onClick={toggleForm}
//               className="text-orange-600 hover:underline"
//             >
//               {isSignIn ? "Sign Up" : "Sign In"}
//             </button>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
