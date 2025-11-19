import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { studentSchema } from "@/lib/validations"
import { generateAdmissionNumber } from "@/lib/utils"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const classId = searchParams.get("classId") || ""

    const where = {
      isActive: true,
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: "insensitive" as const } },
          { lastName: { contains: search, mode: "insensitive" as const } },
          { admissionNo: { contains: search, mode: "insensitive" as const } },
        ],
      }),
      ...(classId && { classId }),
    }

    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where,
        include: {
          class: true,
          section: true,
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.student.count({ where }),
    ])

    return NextResponse.json({
      students,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    })
  } catch (error) {
    console.error("Error fetching students:", error)
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = studentSchema.parse(body)

    const student = await prisma.student.create({
      data: {
        ...validatedData,
        admissionNo: generateAdmissionNumber(),
        dateOfBirth: validatedData.dateOfBirth ? new Date(validatedData.dateOfBirth) : null,
        email: validatedData.email || null,
      },
    })

    return NextResponse.json(student, { status: 201 })
  } catch (error) {
    console.error("Error creating student:", error)
    return NextResponse.json(
      { error: "Failed to create student" },
      { status: 500 }
    )
  }
}