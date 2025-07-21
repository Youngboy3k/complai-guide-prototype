import { motion } from 'framer-motion';
import { Scene3D } from '@/components/3d/Scene3D';
import { ComplianceRing } from '@/components/3d/ComplianceRing';
import { FloatingElements } from '@/components/3d/FloatingElements';
import { TrendingUp, Shield, FileText, MessageCircle, Download, Share2, Upload } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-atmospheric">
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        {/* Hero Section with 3D Visualization */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-elevated p-8 text-center"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-display bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Compliance Dashboard
              </h1>
              <p className="text-body text-muted-foreground max-w-md mx-auto lg:mx-0">
                Advanced AI-powered compliance analysis with real-time monitoring and intelligent insights.
              </p>
              <div className="flex gap-4 justify-center lg:justify-start">
                <button className="btn-primary flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Document
                </button>
                <button className="btn-secondary flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Ask AI Assistant
                </button>
              </div>
            </div>
            <div className="h-64 lg:h-80">
              <Scene3D camera={{ position: [0, 0, 6] }} controls={false}>
                <ComplianceRing score={87} size={2.5} />
                <FloatingElements count={8} spread={6} />
              </Scene3D>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Shield, label: 'Compliance Score', value: '87%', color: 'text-success' },
            { icon: FileText, label: 'Documents Analyzed', value: '1,247', color: 'text-primary' },
            { icon: TrendingUp, label: 'Risk Reduction', value: '23%', color: 'text-accent' },
            { icon: MessageCircle, label: 'AI Interactions', value: '156', color: 'text-secondary' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card-interactive p-6 hover-lift"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br from-white to-gray-50 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-footnote text-muted-foreground uppercase tracking-wide">{stat.label}</p>
                  <p className="text-title-2 font-semibold">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="card-elevated p-6"
        >
          <h2 className="text-headline mb-6">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button className="btn-primary">Analyze New Document</button>
            <button className="btn-secondary">View All Reports</button>
            <button className="btn-ghost flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Data
            </button>
            <button className="btn-ghost flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Share Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;