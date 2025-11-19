"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/hooks/use-toast"
import { Calendar, Save } from "lucide-react"

interface Student {
  id: string
  firstName: string
  lastName: string
  admissionNo: string
  class: { id: string; name: string }
  section: { id: string; name: string }
}

interface AttendanceRecord {
  studentId: string
  status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED"
  notes?: string
}

interface Class {
  id: string
  name: string
  students: Student[]
}

export default function AttendancePage() {
  const [classes, setClasses] = useState<Class[]>([])
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  )
  const [students, setStudents] = useState<Student[]>([])
  const [attendance, setAttendance] = useState<Record<string, AttendanceRecord>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchClasses()
  }, [])

  useEffect(() => {
    if (selectedClass) {
      fetchStudents()
      fetchExistingAttendance()
    }
  }, [selectedClass, selectedDate])

  const fetchClasses = async () => {
    try {
      const response = await fetch("/api/classes")
      if (response.ok) {
        const data = await response.json()
        setClasses(data.classes || [])
      }
    } catch (error) {
      console.error("Error fetching classes:", error)
    }
  }

  const fetchStudents = async () => {
    try {
      const response = await fetch(`/api/students?classId=${selectedClass}&limit=100`)
      if (response.ok) {
        const data = await response.json()
        setStudents(data.students || [])
        
        // Initialize attendance with default PRESENT status
        const initialAttendance: Record<string, AttendanceRecord> = {}
        data.students.forEach((student: Student) => {
          initialAttendance[student.id] = {
            studentId: student.id,
            status: "PRESENT",
            notes: ""
          }
        })
        setAttendance(initialAttendance)
      }
    } catch (error) {
      console.error("Error fetching students:", error)
    }
  }

  const fetchExistingAttendance = async () => {
    try {
      const response = await fetch(
        `/api/attendance?date=${selectedDate}&classId=${selectedClass}`
      )
      if (response.ok) {
        const data = await response.json()
        
        const existingAttendance: Record<string, AttendanceRecord> = {}
        data.attendance.forEach((record: any) => {
          existingAttendance[record.studentId] = {
            studentId: record.studentId,
            status: record.status,
            notes: record.notes || ""
          }
        })
        
        setAttendance(prev => ({
          ...prev,
          ...existingAttendance
        }))
      }
    } catch (error) {
      console.error("Error fetching existing attendance:", error)
    }
  }

  const updateAttendance = (studentId: string, field: keyof AttendanceRecord, value: any) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }))
  }

  const saveAttendance = async () => {
    setLoading(true)
    
    try {
      const attendanceRecords = Object.values(attendance).map(record => ({
        ...record,
        date: selectedDate
      }))

      const response = await fetch("/api/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(attendanceRecords),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Attendance saved successfully",
        })
      } else {
        throw new Error("Failed to save attendance")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save attendance",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PRESENT": return "text-green-600"
      case "ABSENT": return "text-red-600"
      case "LATE": return "text-yellow-600"
      case "EXCUSED": return "text-blue-600"
      default: return "text-gray-600"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
          <p className="text-gray-600">Mark daily attendance for students</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mark Attendance</CardTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Class</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Date</Label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={saveAttendance} disabled={loading || !selectedClass}>
                <Save className="mr-2 h-4 w-4" />
                {loading ? "Saving..." : "Save Attendance"}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {selectedClass && students.length > 0 && (
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Admission No</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.admissionNo}</TableCell>
                    <TableCell>
                      {student.firstName} {student.lastName}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={attendance[student.id]?.status || "PRESENT"}
                        onValueChange={(value) => 
                          updateAttendance(student.id, "status", value as any)
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PRESENT">Present</SelectItem>
                          <SelectItem value="ABSENT">Absent</SelectItem>
                          <SelectItem value="LATE">Late</SelectItem>
                          <SelectItem value="EXCUSED">Excused</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        placeholder="Notes..."
                        value={attendance[student.id]?.notes || ""}
                        onChange={(e) => 
                          updateAttendance(student.id, "notes", e.target.value)
                        }
                        className="w-full"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        )}
      </Card>
    </div>
  )
}