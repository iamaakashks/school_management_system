"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Edit } from "lucide-react"
import { TeacherForm } from "@/components/forms/teacher-form"
import { toast } from "@/hooks/use-toast"

interface Teacher {
  id: string
  phone?: string
  address?: string
  joinDate: string
  user: {
    id: string
    name: string
    email: string
    role: string
  }
  subjects: Array<{ id: string; name: string }>
  classes: Array<{ id: string; name: string }>
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchTeachers()
  }, [])

  const fetchTeachers = async () => {
    try {
      const response = await fetch(`/api/teachers?search=${search}`)
      if (response.ok) {
        const data = await response.json()
        setTeachers(data.teachers)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch teachers",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFormClose = () => {
    setShowForm(false)
    fetchTeachers()
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Teachers</h1>
          <p className="text-muted-foreground">Manage teacher records</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Teacher
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Teacher List</CardTitle>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search teachers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
            <Button onClick={fetchTeachers}>Search</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Subjects</TableHead>
                <TableHead>Classes</TableHead>
                <TableHead>Join Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell>{teacher.user.name}</TableCell>
                  <TableCell>{teacher.user.email}</TableCell>
                  <TableCell>{teacher.phone || "-"}</TableCell>
                  <TableCell>
                    {teacher.subjects.map(s => s.name).join(", ") || "-"}
                  </TableCell>
                  <TableCell>
                    {teacher.classes.map(c => c.name).join(", ") || "-"}
                  </TableCell>
                  <TableCell>
                    {new Date(teacher.joinDate).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {showForm && (
        <TeacherForm onClose={handleFormClose} />
      )}
    </div>
  )
}