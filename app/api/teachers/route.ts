import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { teacherSchema } from "@/lib/validations"
import bcrypt from "bcryptjs"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""

    const where = {
      ...(search && {
        user: {
          name: { contains: search, mode: "insensitive" as const }
        }
      }),
    }

    const teachers = await prisma.teacher.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          }
        },
        subjects: true,
        classes: true,
      },
      orderBy: { joinDate: "desc" },
    })

    return NextResponse.json({ teachers })
  } catch (error) {
    console.error("Error fetching teachers:", error)
    return NextResponse.json(
      { error: "Failed to fetch teachers" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = teacherSchema.parse(body)

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10)

    // Create user and teacher in transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: validatedData.name,
          email: validatedData.email,
          password: hashedPassword,
          role: "TEACHER",
        },
      })

      const teacher = await tx.teacher.create({
        data: {
          userId: user.id,
          phone: validatedData.phone,
          address: validatedData.address,
        },
      })

      return { user, teacher }
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error("Error creating teacher:", error)
    return NextResponse.json(
      { error: "Failed to create teacher" },
      { status: 500 }
    )
  }
}