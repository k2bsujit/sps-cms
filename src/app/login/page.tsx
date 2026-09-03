"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Sun,
  ShieldCheck,
  ArrowRight,
  Lock,
  Mail,
  Zap,
  Building2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("admin@spsurya.com");
  const [password, setPassword] = useState("admin");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    const success = await login(email, password);
    if (!success) {
      setErrorMsg("Invalid credentials. Please try again or use 1-click quick demo login.");
    }
  };

  const handleQuickLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    login(demoEmail, demoPass);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 text-white">
      {/* Background Decorative Circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-md w-full space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 shadow-2xl shadow-amber-500/20 mx-auto">
            <Sun className="w-10 h-10 fill-slate-950 text-slate-950" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center justify-center gap-2">
            SP SURYA <span className="text-amber-400 text-sm font-extrabold px-2 py-0.5 bg-amber-400/10 border border-amber-400/30 rounded-lg">CRM</span>
          </h1>
          <p className="text-xs text-slate-400">
            PM Surya Ghar Muft Bijli Yojana • Customer Management Portal
          </p>
        </div>

        {/* Login Card */}
        <Card className="border border-slate-800 bg-slate-900/90 text-white shadow-2xl backdrop-blur-xl">
          <CardHeader className="pb-4 border-b border-slate-800">
            <CardTitle className="text-base font-bold text-white flex items-center justify-between">
              <span>Staff Authentication</span>
              <Badge variant="outline" className="border-amber-500/40 text-amber-300 text-[10px]">
                Secured SQLite DB
              </Badge>
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Sign in to access Leads Pipeline, 6-Page Proposal Generator & Customer tracking.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 space-y-4">
            {errorMsg && (
              <div className="p-3 bg-red-950/50 border border-red-800 text-red-300 text-xs rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Staff Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sales@spsurya.com"
                    className="pl-9 bg-slate-950/70 border-slate-800 text-white placeholder:text-slate-600 focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-9 bg-slate-950/70 border-slate-800 text-white placeholder:text-slate-600 focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-5 shadow-lg shadow-amber-500/20 mt-2 text-xs uppercase tracking-wider"
              >
                {isLoading ? "Signing in..." : "Access CRM Portal"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </CardContent>

          <CardFooter className="bg-slate-950/80 border-t border-slate-800/80 p-4">
            <div className="w-full space-y-2.5">
              <span className="text-[10px] font-bold text-slate-400 block text-center uppercase tracking-wider">
                1-Click Quick Demo Sign-In:
              </span>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickLogin("admin@spsurya.com", "admin")}
                  className="text-[11px] border-slate-800 bg-slate-900 text-slate-200 hover:bg-amber-500 hover:text-slate-950 font-semibold"
                >
                  Admin
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickLogin("sales@spsurya.com", "sales")}
                  className="text-[11px] border-slate-800 bg-slate-900 text-slate-200 hover:bg-amber-500 hover:text-slate-950 font-semibold"
                >
                  Sales
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickLogin("engineer@spsurya.com", "engineer")}
                  className="text-[11px] border-slate-800 bg-slate-900 text-slate-200 hover:bg-amber-500 hover:text-slate-950 font-semibold"
                >
                  Engineer
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>

        {/* Footer info */}
        <div className="text-center text-[11px] text-slate-500">
          SP Surya Solar Solutions • Nilgiri & Balasore, Odisha
        </div>
      </div>
    </div>
  );
}
