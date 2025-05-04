"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import Tesseract from 'tesseract.js';
import { Label } from "@/components/ui/label";                  

function BillTabs({ onSubmit }: { onSubmit: (data: any) => void }) {
  // Upload state
  const [file, setFile] = React.useState<File | null>(null);
  const [fileError, setFileError] = React.useState<string>("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Manual entry state
  const [provider, setProvider] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [dueDate, setDueDate] = React.useState("");

  const [ocrLoading, setOcrLoading] = React.useState(false);
  const [ocrText, setOcrText] = React.useState<string>("");

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!file) {
      setFileError("Please select a file.");
      return;
    }
  
    setFileError("");
    setOcrLoading(true);
    setOcrText("");
  
    try {
      const { data: { text } } = await Tesseract.recognize(file, "eng", {
        logger: m => console.log(m),
      });
  
      console.log("📝 FINAL OCR TEXT ↴\n", text);
      setOcrText(text);
  
      // 🔥 Call your API route here
      const res = await fetch("/api/analyze-bill", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ billText: text }),
      });
  
      const { savings } = await res.json();
      console.log("💰 Estimated Savings:", savings); // show in console for now
    } catch (err) {
      setFileError("OCR failed. Please try again.");
    } finally {
      setOcrLoading(false);
    }
  };
  
  

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!provider || !amount || !dueDate) return;
    onSubmit({ provider, amount, dueDate });
  };

  return (
    <Tabs defaultValue="upload" className="w-[400px] mx-auto">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="upload">Upload</TabsTrigger>
        <TabsTrigger value="manual">Manual Entry</TabsTrigger>
      </TabsList>
      <TabsContent value="upload">
        <Card>
          <CardHeader>
            <CardTitle>Upload Your Bill</CardTitle>
            <CardDescription>
              Upload your bill as a PDF, JPG, or PNG to see how much you could save!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="bill-file">Select File</Label>
                <Input
                  id="bill-file"
                  type="file"
                  accept=".pdf,image/jpeg,image/png"
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      setFile(e.target.files[0]);
                      setFileError("");
                    }
                  }}
                  ref={fileInputRef}
                />
                {file && (
                  <div className="text-xs text-muted-foreground truncate">Selected: {file.name}</div>
                )}
                {ocrLoading && (
                  <div className="text-xs text-blue-500">Running OCR, please wait...</div>
                )}
                {ocrText && (
                  <div className="text-xs text-green-600 whitespace-pre-wrap border rounded p-2 mt-2 max-h-32 overflow-y-auto">
                    <b>Extracted Text Preview:</b>
                    <br />
                    {ocrText}
                  </div>
                )}
                {fileError && (
                  <div className="text-xs text-red-500">{fileError}</div>
                )}
              </div>
              <CardFooter>
              <Button type="submit" className="w-full" disabled={ocrLoading}>
  Next
</Button>

              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="manual">
        <Card>
          <CardHeader>
            <CardTitle>Enter Bill Details</CardTitle>
            <CardDescription>
              Enter your bill details to see how much you could save!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="provider">Provider Name</Label>
                <Input
                  id="provider"
                  placeholder="e.g. Comcast"
                  value={provider}
                  onChange={e => setProvider(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="$100.00"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="due-date">Due Date</Label>
                <Input
                  id="due-date"
                  type="date"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                  required
                />
              </div>
              <CardFooter>
                <Button type="submit" className="w-full">Next</Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

// Placeholder for Step 3: Show Savings
function StepSavings({ onNext }: { onNext: () => void }) {
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Estimated Savings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-green-600 mb-2">You could save $25/month!</div>
        <div className="mb-4 text-sm text-muted-foreground">(Animated count-up here)</div>
        <Button onClick={onNext}>Generate My Script</Button>
      </CardContent>
    </Card>
  );
}

// Placeholder for Step 4: Show Negotiation Script
function StepScript({ onNext }: { onNext: () => void }) {
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Your Negotiation Script</CardTitle>
      </CardHeader>
      <CardContent>
        <textarea className="w-full border rounded p-2 mb-4" rows={5} readOnly value={"Hi, I noticed my bill is higher than expected..."} />
        <Button className="mb-4 w-full">Copy Script</Button>
        <Button variant="outline" onClick={onNext} className="w-full">Let you handle it for me</Button>
      </CardContent>
    </Card>
  );
}

// Placeholder for Step 5: Paywall/CTA
function StepPaywall() {
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Let Us Negotiate For You</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">Unlock our done-for-you negotiation service!</div>
        <Button className="w-full" disabled>Coming Soon</Button>
      </CardContent>
    </Card>
  );
}

export default function CheckBillPage() {
  const [step, setStep] = React.useState(0);
  // Store the bill data for later steps
  const [billData, setBillData] = React.useState<any>(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-100 p-6">
      {step === 0 && <BillTabs onSubmit={data => { setBillData(data); setStep(1); }} />}
      {step === 1 && <StepSavings onNext={() => setStep(2)} />}
      {step === 2 && <StepScript onNext={() => setStep(3)} />}
      {step === 3 && <StepPaywall />}
    </div>
  );<div className="min-h-screen flex flex-col items-center justify-center bg-muted p-6"></div>
}
