"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Send, Edit, Trash2, Eye, Calendar, Users, AlertCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface Announcement {
  id: string
  title: string
  content: string
  type: 'NEWS' | 'CIRCULAR' | 'ALERT' | 'EVENT'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  targetAudience: 'ALL' | 'STUDENTS' | 'TEACHERS' | 'PARENTS'
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  createdAt: string
  publishedAt?: string
  expiresAt?: string
  authorName: string
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null)
  const [loading, setLoading] = useState(true)

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'NEWS' as const,
    priority: 'MEDIUM' as const,
    targetAudience: 'ALL' as const,
    expiresAt: '',
    publishNow: false
  })

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      // Simulated data - replace with actual API call
      const mockAnnouncements: Announcement[] = [
        {
          id: '1',
          title: 'School Annual Day Celebration',
          content: 'We are excited to announce our Annual Day celebration on December 15th. All students and parents are invited to attend.',
          type: 'EVENT',
          priority: 'HIGH',
          targetAudience: 'ALL',
          status: 'PUBLISHED',
          createdAt: '2024-01-15T10:00:00Z',
          publishedAt: '2024-01-15T10:00:00Z',
          expiresAt: '2024-12-16T00:00:00Z',
          authorName: 'Admin User'
        },
        {
          id: '2',
          title: 'New COVID Guidelines',
          content: 'Updated COVID-19 safety protocols are now in effect. Please ensure all students follow the new guidelines.',
          type: 'CIRCULAR',
          priority: 'URGENT',
          targetAudience: 'ALL',
          status: 'PUBLISHED',
          createdAt: '2024-01-10T14:30:00Z',
          publishedAt: '2024-01-10T14:30:00Z',
          authorName: 'Admin User'
        }
      ]
      setAnnouncements(mockAnnouncements)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch announcements",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      const newAnnouncement: Announcement = {
        id: Date.now().toString(),
        ...formData,
        status: formData.publishNow ? 'PUBLISHED' : 'DRAFT',
        createdAt: new Date().toISOString(),
        publishedAt: formData.publishNow ? new Date().toISOString() : undefined,
        authorName: 'Admin User'
      }

      if (editingAnnouncement) {
        setAnnouncements(prev => 
          prev.map(ann => ann.id === editingAnnouncement.id 
            ? { ...newAnnouncement, id: editingAnnouncement.id } 
            : ann
          )
        )
        toast({
          title: "Success",
          description: "Announcement updated successfully",
        })
      } else {
        setAnnouncements(prev => [newAnnouncement, ...prev])
        toast({
          title: "Success",
          description: formData.publishNow ? "Announcement published successfully" : "Announcement saved as draft",
        })
      }

      resetForm()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save announcement",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      type: 'NEWS',
      priority: 'MEDIUM',
      targetAudience: 'ALL',
      expiresAt: '',
      publishNow: false
    })
    setShowForm(false)
    setEditingAnnouncement(null)
  }

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement)
    setFormData({
      title: announcement.title,
      content: announcement.content,
      type: announcement.type,
      priority: announcement.priority,
      targetAudience: announcement.targetAudience,
      expiresAt: announcement.expiresAt ? announcement.expiresAt.split('T')[0] : '',
      publishNow: false
    })
    setShowForm(true)
  }

  const handlePublish = async (id: string) => {
    setAnnouncements(prev =>
      prev.map(ann =>
        ann.id === id
          ? { ...ann, status: 'PUBLISHED', publishedAt: new Date().toISOString() }
          : ann
      )
    )
    toast({
      title: "Success",
      description: "Announcement published successfully",
    })
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this announcement?')) {
      setAnnouncements(prev => prev.filter(ann => ann.id !== id))
      toast({
        title: "Success",
        description: "Announcement deleted successfully",
      })
    }
  }

  const getTypeColor = (type: string) => {
    const colors = {
      'NEWS': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'CIRCULAR': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'ALERT': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'EVENT': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    }
    return colors[type as keyof typeof colors]
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      'LOW': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      'MEDIUM': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'HIGH': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'URGENT': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    }
    return colors[priority as keyof typeof colors]
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-muted-foreground">Loading announcements...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Announcements</h1>
          <p className="text-muted-foreground">
            Create and manage school news, circulars, and announcements
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center">
          <Plus className="mr-2 h-4 w-4" />
          Create Announcement
        </Button>
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Send className="mr-2 h-5 w-5" />
              {editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div className="md:col-span-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter announcement title"
                    required
                  />
                </div>

                {/* Type */}
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select value={formData.type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NEWS">📰 News</SelectItem>
                      <SelectItem value="CIRCULAR">📋 Circular</SelectItem>
                      <SelectItem value="ALERT">⚠️ Alert</SelectItem>
                      <SelectItem value="EVENT">🎉 Event</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Priority */}
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={formData.priority} onValueChange={(value: any) => setFormData(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">🟢 Low</SelectItem>
                      <SelectItem value="MEDIUM">🟡 Medium</SelectItem>
                      <SelectItem value="HIGH">🟠 High</SelectItem>
                      <SelectItem value="URGENT">🔴 Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Target Audience */}
                <div>
                  <Label htmlFor="audience">Target Audience</Label>
                  <Select value={formData.targetAudience} onValueChange={(value: any) => setFormData(prev => ({ ...prev, targetAudience: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">👥 Everyone</SelectItem>
                      <SelectItem value="STUDENTS">🎓 Students Only</SelectItem>
                      <SelectItem value="TEACHERS">👨‍🏫 Teachers Only</SelectItem>
                      <SelectItem value="PARENTS">👨‍👩‍👧‍👦 Parents Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Expiry Date */}
                <div>
                  <Label htmlFor="expires">Expires On (Optional)</Label>
                  <Input
                    id="expires"
                    type="date"
                    value={formData.expiresAt}
                    onChange={(e) => setFormData(prev => ({ ...prev, expiresAt: e.target.value }))}
                  />
                </div>
              </div>

              {/* Content */}
              <div>
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Enter announcement content..."
                  rows={4}
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <div className="space-x-2">
                  <Button 
                    type="submit" 
                    variant="outline"
                    onClick={() => setFormData(prev => ({ ...prev, publishNow: false }))}
                  >
                    Save as Draft
                  </Button>
                  <Button 
                    type="submit"
                    onClick={() => setFormData(prev => ({ ...prev, publishNow: true }))}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Publish Now
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Announcements List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {announcements.map((announcement) => (
          <Card key={announcement.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{announcement.title}</CardTitle>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge className={getTypeColor(announcement.type)}>
                      {announcement.type}
                    </Badge>
                    <Badge className={getPriorityColor(announcement.priority)}>
                      {announcement.priority}
                    </Badge>
                    <Badge variant="outline">
                      <Users className="mr-1 h-3 w-3" />
                      {announcement.targetAudience}
                    </Badge>
                    <Badge variant={announcement.status === 'PUBLISHED' ? 'default' : 'secondary'}>
                      {announcement.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground line-clamp-3">{announcement.content}</p>
              
              <div className="flex items-center text-xs text-muted-foreground space-x-4">
                <div className="flex items-center">
                  <Calendar className="mr-1 h-3 w-3" />
                  Created: {new Date(announcement.createdAt).toLocaleDateString()}
                </div>
                {announcement.expiresAt && (
                  <div className="flex items-center">
                    <AlertCircle className="mr-1 h-3 w-3" />
                    Expires: {new Date(announcement.expiresAt).toLocaleDateString()}
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-xs text-muted-foreground">
                  By {announcement.authorName}
                </span>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(announcement)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  {announcement.status === 'DRAFT' && (
                    <Button size="sm" onClick={() => handlePublish(announcement.id)}>
                      <Send className="h-4 w-4" />
                    </Button>
                  )}
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleDelete(announcement.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {announcements.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Send className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No Announcements Yet
            </h3>
            <p className="text-muted-foreground mb-4">
              Create your first announcement to keep everyone informed.
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create First Announcement
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}