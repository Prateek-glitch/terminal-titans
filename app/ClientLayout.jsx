"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import ThemeToggle from "@/components/ui/theme-toggle"
import { Toaster, toast } from "react-hot-toast" // For notifications
import { StarIcon, User, ChevronRight } from "lucide-react" // For logo and button icon

// Import the page components directly
import DashboardPage from "./dashboard/page"
import HistoryPage from "./history/page"

export default function ClientLayout() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [scanOutput, setScanOutput] = useState("")
  const [llmInsights, setLlmInsights] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentScanId, setCurrentScanId] = useState(null)

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

    // After setting states:
    console.log("Scan Complete - Output:", output)
    console.log("Scan Complete - Insights:", insights)
    console.log("Scan Complete - Scan ID:", scanId)

    setLoading(false)
  }

  const handleScan = async (scanType) => {
    handleScanStart()

    try {
      const response = await fetch(`${backendUrl}/api/scan/nmap`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ scanType }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      handleScanComplete(data.rawOutput, data.vulnerabilities, data.scanId)
      toast.success(`Nmap scan (${scanType}) simulated and analyzed!`)
    } catch (error) {
      console.error("Error running Nmap scan:", error)
      handleScanComplete(`Error: ${error.message}`, [], null)
      toast.error(`Failed to run scan: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleCustomToolScan = async (tool) => {
    if (!tool.trim()) {
      toast.error("Please enter a custom tool command.")
      return
    }

    handleScanStart()

    try {
      const response = await fetch(`${backendUrl}/api/scan/custom`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tool }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      handleScanComplete(data.rawOutput, data.vulnerabilities, data.scanId)
      toast.success(`${tool} scan simulated and analyzed!`)
    } catch (error) {
      console.error("Error running custom tool scan:", error)
      handleScanComplete(`Error: ${error.message}`, [], null)
      toast.error(`Failed to run custom tool: ${error.message}`)
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
      console.error("Error downloading report:", error)
      toast.error(`Failed to download report: ${error.message}`)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      <Toaster position="top-right" /> {/* Toast notifications */}
      <div className="glassmorphic w-full max-w-6xl p-6 rounded-3xl shadow-lg flex flex-col">
        {/* Header */}
        <header className="w-full flex justify-between items-center mb-8 px-4 py-4 glassmorphic-light rounded-2xl">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-400/30">
                <StarIcon className="h-8 w-8 text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Terminal Titans</h1>
                <p className="text-sm text-gray-400">Advanced Penetration Testing Platform</p>
              </div>
            </div>
            
            {/* Breadcrumbs */}
            <div className="hidden md:flex items-center gap-2 ml-8 text-sm">
              <span className="text-gray-400">Home</span>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <span className="text-white capitalize">{activeTab}</span>
              {activeTab === 'dashboard' && currentScanId && (
                <>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                  <Badge variant="outline" className="text-green-400 border-green-400/50">
                    Scan Active
                  </Badge>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* User Profile Section */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-3 glassmorphic-light px-3 py-2 rounded-xl cursor-pointer hover:bg-white/10 transition-all">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div className="hidden sm:block">
                      <div className="text-sm font-medium text-white">Security Analyst</div>
                      <div className="text-xs text-gray-400">Administrator</div>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>User Profile & Settings</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <ThemeToggle />
            
            {/* Navigation */}
            <nav className="flex space-x-2">
              <Button
                onClick={() => setActiveTab("dashboard")}
                variant="ghost"
                className={`px-4 py-2 rounded-xl text-lg font-semibold transition-all duration-300 ${
                  activeTab === "dashboard" 
                    ? "text-white bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30" 
                    : "text-gray-400 hover:text-white hover:bg-white/10"
                }`}
              >
                Dashboard
                {activeTab === "dashboard" && loading && (
                  <div className="ml-2 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                )}
              </Button>
              <Button
                onClick={() => setActiveTab("history")}
                variant="ghost"
                className={`px-4 py-2 rounded-xl text-lg font-semibold transition-all duration-300 ${
                  activeTab === "history" 
                    ? "text-white bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30" 
                    : "text-gray-400 hover:text-white hover:bg-white/10"
                }`}
              >
                History
              </Button>
            </nav>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 w-full p-4">
          {activeTab === "dashboard" && (
            <DashboardPage
              scanOutput={scanOutput}
              llmInsights={llmInsights}
              loading={loading}
              currentScanId={currentScanId}
              handleScanStart={handleScanStart}
              handleScanComplete={handleScanComplete}
              handleScan={handleScan}
              handleCustomToolScan={handleCustomToolScan}
              handleFileProcessed={handleFileProcessed}
              handleDownloadReport={handleDownloadReport} // Pass this down for the button within DashboardPage if needed
            />
          )}
          {activeTab === "history" && <HistoryPage />}
        </main>

        {/* Footer */}
        <footer className="w-full text-center text-gray-500 text-sm mt-8 pt-4 border-t border-white/10">
          <p>Pentest App Team 2024</p>
        </footer>
      </div>
    </div>
  )
}
