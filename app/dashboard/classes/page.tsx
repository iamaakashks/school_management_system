"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus } from "lucide-react"
import { ClassForm } from "@/components/forms/class-form"
import { toast } from "@/hooks/use-toast"

interface Class {
  id: string
  name: string
  description?: string
  teacher?: {
    user: {
      name: string
    }
  }
  _count: {
    students: number
  }
  sections: Array<{ id: string; name: string }>
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    try {
      const response = await fetch("/api/classes")
      if (response.ok) {
        const data = await response.json()
        setClasses(data.classes)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch classes",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFormClose = () => {
    setShowForm(false)
    fetchClasses()
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Classes</h1>
          <p className="text-gray-600">Manage class information</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Class
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Class List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Class Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Sections</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classes.map((cls) => (
                <TableRow key={cls.id}>
                  <TableCell className="font-medium">{cls.name}</TableCell>
                  <TableCell>{cls.description || "-"}</TableCell>
                  <TableCell>{cls.teacher?.user.name || "Not assigned"}</TableCell>
                  <TableCell>{cls._count.students}</TableCell>
                  <TableCell>
                    {cls.sections.map(s => s.name).join(", ") || "No sections"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {showForm && (
        <ClassForm onClose={handleFormClose} />
      )}
    </div>
  )
}