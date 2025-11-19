import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { classSchema } from "@/lib/validations"

export async function GET() {
  try {
    const classes = await prisma.class.findMany({
      include: {
        teacher: {
          include: {
            user: {
              select: {
                name: true
              }
            }
          }
        },
        sections: true,
        students: {
          where: { isActive: true },
          select: { id: true }
        },
        _count: {
          select: {
            students: {
              where: { isActive: true }
            }
          }
        }
      },
      orderBy: { name: "asc" },
    })

    return NextResponse.json({ classes })
  } catch (error) {
    console.error("Error fetching classes:", error)
    return NextResponse.json(
      { error: "Failed to fetch classes" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = classSchema.parse(body)

    const classData = await prisma.class.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        teacherId: validatedData.teacherId || null,
      },
    })

    return NextResponse.json(classData, { status: 201 })
  } catch (error) {
    console.error("Error creating class:", error)
    return NextResponse.json(
      { error: "Failed to create class" },
      { status: 500 }
    )
  }
}