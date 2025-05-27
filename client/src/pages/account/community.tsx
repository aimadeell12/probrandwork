import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, MessageSquare, Heart, Share2, Calendar, Trophy } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function Community() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get community stats
  const { data: stats } = useQuery({
    queryKey: ['/api/community/stats'],
    queryFn: () => apiRequest('GET', '/api/community/stats').then(res => res.json())
  });

  // Get discussions
  const { data: discussions = [] } = useQuery({
    queryKey: ['/api/community/discussions'],
    queryFn: () => apiRequest('GET', '/api/community/discussions').then(res => res.json())
  });

  // Get events
  const { data: events = [] } = useQuery({
    queryKey: ['/api/community/events'],
    queryFn: () => apiRequest('GET', '/api/community/events').then(res => res.json())
  });

  // Get top contributors
  const { data: contributors = [] } = useQuery({
    queryKey: ['/api/community/contributors'],
    queryFn: () => apiRequest('GET', '/api/community/contributors').then(res => res.json())
  });

  // Join event mutation
  const joinEventMutation = useMutation({
    mutationFn: (eventId: string) => 
      apiRequest('POST', `/api/community/events/${eventId}/join`).then(res => res.json()),
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "You have successfully joined the event"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/community/events'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to join event",
        variant: "destructive"
      });
    }
  });

  const joinDiscussion = (id: string) => {
    toast({
      title: "Joined Discussion",
      description: "You can now participate in this discussion"
    });
  };

  const likePost = (id: string) => {
    toast({
      title: "Liked!",
      description: "Post has been liked"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 dark:from-gray-900 dark:via-purple-900 dark:to-purple-900 relative overflow-hidden">
      
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-gradient-to-tr from-purple-200/20 to-pink-200/20 rounded-full blur-3xl"></div>
      
      <div className="px-4 sm:px-6 lg:px-8 py-6 pb-20 relative z-10">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/services")}
            className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900/30"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Community
          </h1>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30">
            <CardContent className="p-4 text-center">
              <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <p className="text-lg font-bold text-gray-900 dark:text-white">{stats?.totalMembers?.toLocaleString() || 0}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Total Members</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30">
            <CardContent className="p-4 text-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mb-2"></div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{stats?.onlineNow || 0}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Online Now</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30">
            <CardContent className="p-4 text-center">
              <MessageSquare className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <p className="text-lg font-bold text-gray-900 dark:text-white">{stats?.postsToday || 0}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Posts Today</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30">
            <CardContent className="p-4 text-center">
              <Heart className="h-6 w-6 text-red-600 mx-auto mb-2" />
              <p className="text-lg font-bold text-gray-900 dark:text-white">{stats?.helpfulAnswers || 0}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Helpful Answers</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Discussions */}
        <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30 mb-6">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Recent Discussions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {discussions.length === 0 ? (
                <div className="text-center text-gray-600 dark:text-gray-400 py-8">
                  No discussions found
                </div>
              ) : (
                discussions.map((discussion: any) => (
                  <div key={discussion.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback>{discussion.author?.charAt(0) || 'U'}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                              {discussion.title}
                              {discussion.isPopular && (
                                <Badge variant="secondary" className="ml-2 text-xs">Popular</Badge>
                              )}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              by {discussion.author || 'Anonymous'} • {new Date(discussion.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {discussion.category}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-3">
                          <button 
                            onClick={() => likePost(discussion.id)}
                            className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-red-600"
                          >
                            <Heart className="h-4 w-4" />
                            {discussion.likes || 0}
                          </button>
                          <button 
                            onClick={() => joinDiscussion(discussion.id)}
                            className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600"
                          >
                            <MessageSquare className="h-4 w-4" />
                            {discussion.replies || 0}
                          </button>
                          <button className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-green-600">
                            <Share2 className="h-4 w-4" />
                            Share
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <Button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800">
              View All Discussions
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Calendar className="h-5 w-5" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {events.length === 0 ? (
                <div className="text-center text-gray-600 dark:text-gray-400 py-4">
                  No upcoming events
                </div>
              ) : (
                events.map((event: any) => (
                  <div key={event.id} className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {event.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {new Date(event.eventDate).toLocaleDateString()} at {event.eventTime}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-500">
                        {event.currentAttendees || 0} attending
                      </span>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => joinEventMutation.mutate(event.id)}
                        disabled={joinEventMutation.isPending}
                      >
                        Join Event
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Contributors */}
        <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-white/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Trophy className="h-5 w-5" />
              Top Contributors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topContributors.map((contributor, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {contributor.name}
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        {contributor.badge}
                      </Badge>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-purple-600">
                    {contributor.points} pts
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}