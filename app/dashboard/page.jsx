"use client"

import { useState } from "react"
import GlassmorphicContainer from "@/components/layout/GlassmorphicContainer"
import ScanOutputDisplay from "@/components/dashboard/ScanOutputDisplay"
import FileUpload from "@/components/FileUpload"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label" // Import Label for checkboxes
import { toast } from "react-hot-toast"
import { Loader2, ArrowUpRight } from "lucide-react"
import LLMInsightsDisplay from "@/components/dashboard/LLMInsightsDisplay"

export default function Dashboard() {
  const [scanOutput, setScanOutput] = useState("")
  const [llmInsights, setLlmInsights] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentScanId, setCurrentScanId] = useState(null)
  const [targetUrl, setTargetUrl] = useState("") // New state for target URL
  const [selectedTools, setSelectedTools] = useState([]) // New state for selected tools

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"

  const handleScanStart = () => {
    setLoading(true)
    setScanOutput("Scanning in progress... Please wait.")
    setLlmInsights([]) // Clear previous insights
    setCurrentScanId(null)
  }

  const handleScanComplete = (output, insights, scanId) => {
    setScanOutput(output)
    setLlmInsights(insights)
    setCurrentScanId(scanId)
    setLoading(false)
  }

  const handleToolChange = (tool) => {
    setSelectedTools((prev) => (prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]))
  }

  const handleRunSelectedScans = async () => {
    if (!targetUrl.trim()) {
      toast.error("Please enter a target URL.")
      return
    }
    if (selectedTools.length === 0) {
      toast.error("Please select at least one scan tool.")
      return
    }

    handleScanStart()

    try {
      const response = await fetch(`${backendUrl}/api/run-scans`, {
        // New unified endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ targetUrl, selectedTools }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      handleScanComplete(data.rawOutput, data.vulnerabilities, data.scanId)
      toast.success(`Selected scans completed for ${targetUrl}!`)
    } catch (error) {
      console.error("Error running selected scans:", error)
      handleScanComplete(`Error: ${error.message}`, [], null)
      toast.error(`Failed to run scans: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleFileProcessed = (output, insights, scanId) => {
    handleScanComplete(output, insights, scanId)
  }

  const handleDownloadReport = async () => {
    if (!currentScanId) {
      toast.error("No scan data available to generate a report.")
      return
    }

    console.log("Attempting to download report for scan ID:", currentScanId)
    console.log("Backend URL:", backendUrl)
    console.log(`Fetching from: ${backendUrl}/api/report/${currentScanId}`)

    try {
      const response = await fetch(`${backendUrl}/api/report/${currentScanId}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `pentest_report_${currentScanId}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
      toast.success("PDF report downloaded successfully!")
    } catch (error) {
      console.error("Error during report download fetch:", error)
      console.error("Error downloading report:", error)
      toast.error(`Failed to download report: ${error.message}`)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Top Left Card: Target URL & Tool Selection */}
      <GlassmorphicContainer className="flex flex-col gap-6 p-8">
        <h2 className="text-2xl font-bold text-white mb-4">Configure & Run Scan</h2>

        {/* Target URL Input */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="target-url" className="text-white text-lg">
            Target URL
          </Label>
          <Input
            id="target-url"
            type="url"
            placeholder="https://example.com"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            className="bg-white/5 text-white border-white/10 placeholder-gray-400 p-3 text-base"
            disabled={loading}
          />
        </div>

        {/* Tool Selection Checkboxes */}
        <div className="flex flex-col gap-3 mt-4">
          <h3 className="text-xl font-semibold text-white">Select Scan Tools (Simulated)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Nmap -sV -A -O */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="nmap-full"
                checked={selectedTools.includes("nmap-sV-A-O")}
                onChange={() => handleToolChange("nmap-sV-A-O")}
                disabled={loading}
                className="form-checkbox h-5 w-5 text-blue-600 bg-white/5 border-white/10 rounded focus:ring-blue-500"
              />
              <Label htmlFor="nmap-full" className="text-white">
                Nmap (-sV -A -O)
              </Label>
            </div>
            {/* Nmap --script vuln */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="nmap-vuln"
                checked={selectedTools.includes("nmap-script-vuln")}
                onChange={() => handleToolChange("nmap-script-vuln")}
                disabled={loading}
                className="form-checkbox h-5 w-5 text-blue-600 bg-white/5 border-white/10 rounded focus:ring-blue-500"
              />
              <Label htmlFor="nmap-vuln" className="text-white">
                Nmap (--script vuln)
              </Label>
            </div>
            {/* Nikto */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="nikto"
                checked={selectedTools.includes("nikto")}
                onChange={() => handleToolChange("nikto")}
                disabled={loading}
                className="form-checkbox h-5 w-5 text-blue-600 bg-white/5 border-white/10 rounded focus:ring-blue-500"
              />
              <Label htmlFor="nikto" className="text-white">
                Nikto
              </Label>
            </div>
            {/* WhatWeb */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="whatweb"
                checked={selectedTools.includes("whatweb")}
                onChange={() => handleToolChange("whatweb")}
                disabled={loading}
                className="form-checkbox h-5 w-5 text-blue-600 bg-white/5 border-white/10 rounded focus:ring-blue-500"
              />
              <Label htmlFor="whatweb" className="text-white">
                WhatWeb
              </Label>
            </div>
            {/* Nuclei */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="nuclei"
                checked={selectedTools.includes("nuclei")}
                onChange={() => handleToolChange("nuclei")}
                disabled={loading}
                className="form-checkbox h-5 w-5 text-blue-600 bg-white/5 border-white/10 rounded focus:ring-blue-500"
              />
              <Label htmlFor="nuclei" className="text-white">
                Nuclei
              </Label>
            </div>
          </div>
        </div>

        {/* Run Scans Button */}
        <Button
          onClick={handleRunSelectedScans}
          disabled={loading || !targetUrl.trim() || selectedTools.length === 0}
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 text-base mt-6"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Running Scans...
            </>
          ) : (
            "Run Selected Scans"
          )}
        </Button>

        {/* File Upload (remains separate) */}
        <div className="mt-8 pt-4 border-t border-white/10">
          <FileUpload onScanStart={handleScanStart} onScanComplete={handleFileProcessed} />
        </div>
      </GlassmorphicContainer>

      {/* Top Right Card: Scan Output Display */}
      <GlassmorphicContainer className="flex flex-col gap-6 p-8">
        <ScanOutputDisplay output={scanOutput} insights={llmInsights} />
      </GlassmorphicContainer>

      {/* Bottom Left Card: LLM Insights Display */}
      <GlassmorphicContainer className="flex flex-col gap-6 p-8">
        <LLMInsightsDisplay insights={llmInsights} />
      </GlassmorphicContainer>

      {/* Bottom Right Card: Download Report */}
      <GlassmorphicContainer className="flex flex-col gap-6 p-8 justify-center items-center">
        <h3 className="text-xl font-semibold text-white mb-4">Generate & Download Report</h3>
        <p className="text-gray-400 text-center mb-6">
          Once a scan is complete, you can download a comprehensive PDF report.
        </p>
        <Button
          onClick={handleDownloadReport}
          disabled={!currentScanId || loading}
          className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-full transition-colors duration-200 flex items-center space-x-2"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
            </>
          ) : (
            <>
              <span>Download Report</span>
              <ArrowUpRight className="h-5 w-5" />
            </>
          )}
        </Button>
        {!currentScanId && !loading && (
          <p className="text-sm text-gray-500 mt-2">Run a scan first to enable report download.</p>
        )}
      </GlassmorphicContainer>
    </div>
  )
}
