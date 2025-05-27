import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Users, MessageSquare, Calendar, Plus, Search, Trophy } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AdminCommunity() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    eventDate: '',
    eventTime: '',
    maxAttendees: ''
  });

  // Get community statistics
  const { data: stats } = useQuery({
    queryKey: ['/api/admin/community/stats'],
    queryFn: () => apiRequest('GET', '/api/admin/community/stats').then(res => res.json())
  });

  // Get all discussions
  const { data: discussions = [] } = useQuery({
    queryKey: ['/api/admin/community/discussions'],
    queryFn: () => apiRequest('GET', '/api/admin/community/discussions').then(res => res.json())
  });

  // Get all events
  const { data: events = [] } = useQuery({
    queryKey: ['/api/admin/community/events'],
    queryFn: () => apiRequest('GET', '/api/admin/community/events').then(res => res.json())
  });

  // Get contributors
  const { data: contributors = [] } = useQuery({
    queryKey: ['/api/admin/community/contributors'],
    queryFn: () => apiRequest('GET', '/api/admin/community/contributors').then(res => res.json())
  });

  // Create event mutation
  const createEventMutation = useMutation({
    mutationFn: (data: any) =>
      apiRequest('POST', '/api/admin/community/events', data).then(res => res.json()),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Event created successfully"
      });
      setIsEventDialogOpen(false);
      setNewEvent({ title: '', description: '', eventDate: '', eventTime: '', maxAttendees: '' });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/community/events'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/community/stats'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create event",
        variant: "destructive"
      });
    }
  });

  // Moderate discussion mutation
  const moderateDiscussionMutation = useMutation({
    mutationFn: ({ id, action }: { id: string; action: string }) =>
      apiRequest('PATCH', `/api/admin/community/discussions/${id}`, { action }).then(res => res.json()),
    onSuccess: (_, variables) => {
      toast({
        title: "Success",
        description: `Discussion ${variables.action} successfully`
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/community/discussions'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to moderate discussion",
        variant: "destructive"
      });
    }
  });

  const handleCreateEvent = () => {
    const eventData = {
      ...newEvent,
      maxAttendees: newEvent.maxAttendees ? parseInt(newEvent.maxAttendees) : null,
      eventDate: new Date(newEvent.eventDate).toISOString(),
    };
    createEventMutation.mutate(eventData);
  };

  const filteredDiscussions = discussions.filter((discussion: any) =>
    discussion.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    discussion.author?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 dark:from-gray-900 dark:via-purple-900 dark:to-purple-900 relative overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 dark:bg-pink-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 p-4 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/admin")}
              className="shrink-0 hover:bg-white/20 dark:hover:bg-gray-800/20"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Community Management
            </h1>
          </div>
          
          <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800">
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create Community Event</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Event Title</Label>
                  <Input
                    id="title"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    placeholder="Virtual Banking Workshop"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                    placeholder="Learn about digital banking features..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="eventDate">Event Date</Label>
                    <Input
                      id="eventDate"
                      type="date"
                      value={newEvent.eventDate}
                      onChange={(e) => setNewEvent({...newEvent, eventDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="eventTime">Event Time</Label>
                    <Input
                      id="eventTime"
                      type="time"
                      value={newEvent.eventTime}
                      onChange={(e) => setNewEvent({...newEvent, eventTime: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="maxAttendees">Max Attendees</Label>
                  <Input
                    id="maxAttendees"
                    type="number"
                    value={newEvent.maxAttendees}
                    onChange={(e) => setNewEvent({...newEvent, maxAttendees: e.target.value})}
                    placeholder="Optional"
                  />
                </div>
                <Button 
                  onClick={handleCreateEvent} 
                  className="w-full"
                  disabled={createEventMutation.isPending}
                >
                  Create Event
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30">
            <CardContent className="p-4 text-center">
              <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <p className="text-lg font-bold text-gray-900 dark:text-white">{stats?.totalMembers || 0}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Total Members</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30">
            <CardContent className="p-4 text-center">
              <MessageSquare className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <p className="text-lg font-bold text-gray-900 dark:text-white">{stats?.totalDiscussions || 0}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Discussions</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30">
            <CardContent className="p-4 text-center">
              <Calendar className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <p className="text-lg font-bold text-gray-900 dark:text-white">{stats?.totalEvents || 0}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Events</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30">
            <CardContent className="p-4 text-center">
              <Trophy className="h-6 w-6 text-orange-600 mx-auto mb-2" />
              <p className="text-lg font-bold text-gray-900 dark:text-white">{stats?.activeContributors || 0}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Contributors</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search discussions by title or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-0 bg-transparent"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Discussions Management */}
          <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Recent Discussions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredDiscussions.length === 0 ? (
                  <div className="text-center text-gray-600 dark:text-gray-400 py-8">
                    No discussions found
                  </div>
                ) : (
                  filteredDiscussions.slice(0, 5).map((discussion: any) => (
                    <div key={discussion.id} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                          {discussion.title}
                        </h4>
                        <Badge variant="outline" className="text-xs">
                          {discussion.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                        by {discussion.author || 'Anonymous'} • {discussion.replies || 0} replies • {discussion.likes || 0} likes
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => moderateDiscussionMutation.mutate({ 
                            id: discussion.id, 
                            action: 'pin' 
                          })}
                          disabled={moderateDiscussionMutation.isPending}
                        >
                          Pin
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => moderateDiscussionMutation.mutate({ 
                            id: discussion.id, 
                            action: 'hide' 
                          })}
                          disabled={moderateDiscussionMutation.isPending}
                        >
                          Hide
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Events Management */}
          <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {events.length === 0 ? (
                  <div className="text-center text-gray-600 dark:text-gray-400 py-8">
                    No events found
                  </div>
                ) : (
                  events.slice(0, 5).map((event: any) => (
                    <div key={event.id} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                        {event.title}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                        {new Date(event.eventDate).toLocaleDateString()} at {event.eventTime}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {event.currentAttendees || 0} attending
                        {event.maxAttendees && ` / ${event.maxAttendees} max`}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Contributors */}
        <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Top Contributors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {contributors.length === 0 ? (
                <div className="col-span-full text-center text-gray-600 dark:text-gray-400 py-8">
                  No contributors found
                </div>
              ) : (
                contributors.slice(0, 6).map((contributor: any, index: number) => (
                  <div key={contributor.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        {contributor.name || 'Anonymous'}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {contributor.points || 0} points
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {contributor.badge || 'Member'}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}