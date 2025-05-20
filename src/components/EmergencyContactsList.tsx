import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { EmergencyContact } from "@/types";
import { useData } from '@/contexts/DataContext';
import { Form } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Phone, Plus, Trash2, User, Ambulance, FireExtinguisher, Building } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const EmergencyContactsList: React.FC = () => {
  const { emergencyContacts, addEmergencyContact, removeEmergencyContact } = useData();
  const { user } = useAuth();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newContact, setNewContact] = useState({
    name: "",
    phone: "",
    relationship: ""
  });

  // Default government emergency services for India
  const governmentServices = [
    { id: "gov_1", name: "National Emergency", phone: "112", relationship: "Emergency Services", isGovernment: true },
    { id: "gov_2", name: "Ambulance", phone: "108", relationship: "Medical Services", isGovernment: true },
    { id: "gov_3", name: "Police", phone: "100", relationship: "Law Enforcement", isGovernment: true },
    { id: "gov_4", name: "Fire Department", phone: "101", relationship: "Fire Services", isGovernment: true },
    { id: "gov_5", name: "Women Helpline", phone: "1091", relationship: "Women Safety", isGovernment: true },
    { id: "gov_6", name: "Child Helpline", phone: "1098", relationship: "Child Protection", isGovernment: true },
  ];

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    addEmergencyContact(newContact);
    setNewContact({ name: "", phone: "", relationship: "" });
    setIsAddDialogOpen(false);
  };

  const getIconForContact = (contact: EmergencyContact & { isGovernment?: boolean }) => {
    if (contact.isGovernment) {
      if (contact.name.toLowerCase().includes("ambulance") || contact.relationship.toLowerCase().includes("medical")) {
        return <Ambulance className="h-5 w-5 text-red-500" />;
      } else if (contact.name.toLowerCase().includes("fire") || contact.relationship.toLowerCase().includes("fire")) {
        return <FireExtinguisher className="h-5 w-5 text-orange-500" />;
      } else if (contact.name.toLowerCase().includes("police") || contact.relationship.toLowerCase().includes("law")) {
        return <Building className="h-5 w-5 text-blue-500" />;
      }
    }
    return <User className="h-5 w-5" />;
  };

  // Combine government services with user contacts
  const allContacts = [...governmentServices, ...emergencyContacts];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Emergency Contacts</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Emergency Contact</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddContact} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newContact.name}
                  onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                  placeholder="Contact name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={newContact.phone}
                  onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                  placeholder="Phone number"
                  required
                  type="tel"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="relationship">Relationship</Label>
                <Input
                  id="relationship"
                  value={newContact.relationship}
                  onChange={(e) => setNewContact({...newContact, relationship: e.target.value})}
                  placeholder="Family, Friend, etc."
                />
              </div>
              
              <DialogFooter>
                <Button type="submit">Add Contact</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-3 max-h-[500px] overflow-y-auto pr-1">
        <div className="sticky top-0 bg-background p-2 border-b text-xs font-medium text-muted-foreground">
          Government Emergency Services
        </div>
        {governmentServices.map((contact) => (
          <Card key={contact.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-accent rounded-full p-2">
                    {getIconForContact(contact)}
                  </div>
                  <div>
                    <p className="font-medium">{contact.name}</p>
                    <div className="flex items-center text-sm text-muted-foreground space-x-2">
                      <span>{contact.relationship}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon" asChild>
                    <a href={`tel:${contact.phone}`}>
                      <Phone className="h-4 w-4 text-green-600" />
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {emergencyContacts.length > 0 && (
          <div className="sticky top-0 bg-background p-2 border-b text-xs font-medium text-muted-foreground mt-4">
            Personal Emergency Contacts
          </div>
        )}
        
        {emergencyContacts.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              <p>No personal emergency contacts added yet.</p>
              <p className="text-sm">Add contacts to quickly reach them during emergencies.</p>
            </CardContent>
          </Card>
        ) : (
          emergencyContacts.map((contact) => (
            <Card key={contact.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-accent rounded-full p-2">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{contact.name}</p>
                      <div className="flex items-center text-sm text-muted-foreground space-x-2">
                        <span>{contact.relationship}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" asChild>
                      <a href={`tel:${contact.phone}`}>
                        <Phone className="h-4 w-4 text-green-600" />
                      </a>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => removeEmergencyContact(contact.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default EmergencyContactsList;
