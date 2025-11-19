import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { studentSchema } from "@/lib/validations"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const student = await prisma.student.findUnique({
      where: { id: params.id },
      include: {
        class: true,
        section: true,
        attendance: {
          orderBy: { date: "desc" },
          take: 10,
        },
      },
    })

    if (!student) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(student)
  } catch (error) {
    console.error("Error fetching student:", error)
    return NextResponse.json(
      { error: "Failed to fetch student" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const validatedData = studentSchema.parse(body)

    const student = await prisma.student.update({
      where: { id: params.id },
      data: {
        ...validatedData,
        dateOfBirth: validatedData.dateOfBirth ? new Date(validatedData.dateOfBirth) : null,
        email: validatedData.email || null,
      },
    })

    return NextResponse.json(student)
  } catch (error) {
    console.error("Error updating student:", error)
    return NextResponse.json(
      { error: "Failed to update student" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.student.update({
      where: { id: params.id },
      data: { isActive: false },
    })

    return NextResponse.json({ message: "Student deleted successfully" })
  } catch (error) {
    console.error("Error deleting student:", error)
    return NextResponse.json(
      { error: "Failed to delete student" },
      { status: 500 }
    )
  }
}