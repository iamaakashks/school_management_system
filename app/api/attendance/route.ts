import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { attendanceSchema } from "@/lib/validations"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date")
    const classId = searchParams.get("classId")
    const studentId = searchParams.get("studentId")

    let where: any = {}

    if (date) {
      const startDate = new Date(date)
      const endDate = new Date(date)
      endDate.setHours(23, 59, 59, 999)
      where.date = {
        gte: startDate,
        lte: endDate
      }
    }

    if (studentId) {
      where.studentId = studentId
    }

    if (classId) {
      where.student = {
        classId: classId
      }
    }

    const attendance = await prisma.attendance.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            admissionNo: true,
            class: true,
            section: true,
          }
        }
      },
      orderBy: [{ date: "desc" }, { student: { firstName: "asc" } }],
    })

    return NextResponse.json({ attendance })
  } catch (error) {
    console.error("Error fetching attendance:", error)
    return NextResponse.json(
      { error: "Failed to fetch attendance" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (Array.isArray(body)) {
      // Bulk attendance marking
      const attendanceRecords = body.map(record => ({
        ...record,
        date: new Date(record.date)
      }))

      // Use upsert to handle duplicate entries
      const results = await Promise.all(
        attendanceRecords.map(record =>
          prisma.attendance.upsert({
            where: {
              studentId_date: {
                studentId: record.studentId,
                date: record.date
              }
            },
            update: {
              status: record.status,
              notes: record.notes
            },
            create: record
          })
        )
      )

      return NextResponse.json({ attendance: results }, { status: 201 })
    } else {
      // Single attendance record
      const validatedData = attendanceSchema.parse(body)
      
      const attendance = await prisma.attendance.upsert({
        where: {
          studentId_date: {
            studentId: validatedData.studentId,
            date: new Date(validatedData.date)
          }
        },
        update: {
          status: validatedData.status,
          notes: validatedData.notes
        },
        create: {
          ...validatedData,
          date: new Date(validatedData.date)
        }
      })

      return NextResponse.json(attendance, { status: 201 })
    }
  } catch (error) {
    console.error("Error creating attendance:", error)
    return NextResponse.json(
      { error: "Failed to create attendance" },
      { status: 500 }
    )
  }
}