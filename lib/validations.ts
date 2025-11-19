import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
})

export const studentSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  dateOfBirth: z.string().optional(),
  rollNo: z.string().optional(),
  fatherName: z.string().optional(),
  motherName: z.string().optional(),
  guardianPhone: z.string().optional(),
  classId: z.string().optional(),
  sectionId: z.string().optional(),
})

export const teacherSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
  address: z.string().optional(),
})

export const classSchema = z.object({
  name: z.string().min(1, "Class name is required"),
  description: z.string().optional(),
  teacherId: z.string().optional(),
})

export const sectionSchema = z.object({
  name: z.string().min(1, "Section name is required"),
  classId: z.string().min(1, "Class is required"),
})

export const subjectSchema = z.object({
  name: z.string().min(1, "Subject name is required"),
  code: z.string().min(1, "Subject code is required"),
  teacherId: z.string().optional(),
  classId: z.string().optional(),
})

export const attendanceSchema = z.object({
  studentId: z.string().min(1, "Student is required"),
  date: z.string().min(1, "Date is required"),
  status: z.enum(["PRESENT", "ABSENT", "LATE", "EXCUSED"]),
  notes: z.string().optional(),
})