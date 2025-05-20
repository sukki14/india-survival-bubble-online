import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import Header from '@/components/Header';
import DisasterAlert from '@/components/DisasterAlert';
import DisasterDetails from '@/components/DisasterDetails';
import EmergencyContactsList from '@/components/EmergencyContactsList';
import CommunitySyncChat from '@/components/CommunitySyncChat';
import ResourceMap from '@/components/ResourceMap';
import DisasterChecklist from '@/components/DisasterChecklist';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DisasterAlert as DisasterAlertType } from '@/types';
import { Bell, Info } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { getLocalDisasters } = useData();
  const navigate = useNavigate();
  const [selectedAlert, setSelectedAlert] = useState<DisasterAlertType | null>(null);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  
  // Redirect if not authenticated
  React.useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);
  
  // Get local disasters
  const localDisasters = user?.location ? getLocalDisasters(user.location) : [];
  
  const handleViewAlertDetails = (alert: DisasterAlertType) => {
    setSelectedAlert(alert);
    setIsAlertDialogOpen(true);
  };
  
  if (!user) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="space-y-6 col-span-1 md:col-span-2">
            {/* Alerts section */}
            <section>
              <h2 className="text-lg font-semibold mb-3 flex items-center">
                <Bell className="mr-2 h-5 w-5 text-primary" />
                Disaster Alerts
              </h2>
              
              {localDisasters.length === 0 ? (
                <Card className="bg-green-50 border-green-200 p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Info className="h-5 w-5 text-green-600 mr-2" />
                    <span className="font-medium text-green-800">No active alerts</span>
                  </div>
                  <p className="text-sm text-green-700">
                    There are currently no disaster alerts for your area. Stay safe!
                  </p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {localDisasters.map((alert) => (
                    <DisasterAlert 
                      key={alert.id} 
                      alert={alert} 
                      onViewDetails={handleViewAlertDetails}
                    />
                  ))}
                </div>
              )}
            </section>
            
            {/* Tabs for different features */}
            <Tabs defaultValue="resources" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="checklist">Checklist</TabsTrigger>
                <TabsTrigger value="community">Community</TabsTrigger>
              </TabsList>
              
              <TabsContent value="resources" className="mt-0">
                <ResourceMap />
              </TabsContent>
              
              <TabsContent value="checklist" className="mt-0">
                <DisasterChecklist />
              </TabsContent>
              
              <TabsContent value="community" className="mt-0">
                <CommunitySyncChat />
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Right column */}
          <div className="space-y-6">
            <EmergencyContactsList />
            
            {/* Information card */}
            <Card className="p-4 bg-accent border-none">
              <h3 className="font-medium mb-2 flex items-center">
                <Info className="mr-2 h-4 w-4 text-primary" />
                About Survival Bubble
              </h3>
              <p className="text-sm mb-3">
                Survival Bubble helps you stay prepared for disasters in India with real-time alerts, 
                resource mapping, and community coordination.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Learn More
              </Button>
            </Card>
          </div>
        </div>
      </main>
      
      {/* Alert details dialog */}
      <Dialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          {selectedAlert && <DisasterDetails alert={selectedAlert} />}
        </DialogContent>
      </Dialog>
      
      <footer className="bg-muted mt-6 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Survival Bubble India. All rights reserved.</p>
          <p className="mt-1">Emergency Helplines: 112 (National Emergency), 108 (Ambulance), 101 (Fire)</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
