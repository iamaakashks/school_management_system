import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@school.com' },
    update: {},
    create: {
      email: 'admin@school.com',
      name: 'System Administrator',
      password: adminPassword,
      role: 'ADMIN',
    },
  })
  console.log('👤 Created admin user:', admin.email)

  // Create teacher user and teacher record
  const teacherPassword = await bcrypt.hash('teacher123', 10)
  const teacherUser = await prisma.user.upsert({
    where: { email: 'teacher@school.com' },
    update: {},
    create: {
      email: 'teacher@school.com',
      name: 'John Teacher',
      password: teacherPassword,
      role: 'TEACHER',
    },
  })

  const teacher = await prisma.teacher.upsert({
    where: { userId: teacherUser.id },
    update: {},
    create: {
      userId: teacherUser.id,
      phone: '+1234567890',
      address: '123 Teacher Street',
    },
  })
  console.log('👨‍🏫 Created teacher:', teacherUser.name)

  // Create another teacher
  const teacher2Password = await bcrypt.hash('teacher123', 10)
  const teacher2User = await prisma.user.upsert({
    where: { email: 'jane.teacher@school.com' },
    update: {},
    create: {
      email: 'jane.teacher@school.com',
      name: 'Jane Smith',
      password: teacher2Password,
      role: 'TEACHER',
    },
  })

  const teacher2 = await prisma.teacher.upsert({
    where: { userId: teacher2User.id },
    update: {},
    create: {
      userId: teacher2User.id,
      phone: '+1234567891',
      address: '456 Teacher Avenue',
    },
  })
  console.log('👩‍🏫 Created teacher:', teacher2User.name)

  // Create classes
  const grade1 = await prisma.class.upsert({
    where: { name: 'Grade 1' },
    update: {},
    create: {
      name: 'Grade 1',
      description: 'First grade students',
      teacherId: teacher.id,
    },
  })

  const grade2 = await prisma.class.upsert({
    where: { name: 'Grade 2' },
    update: {},
    create: {
      name: 'Grade 2',
      description: 'Second grade students',
      teacherId: teacher2.id,
    },
  })

  const grade3 = await prisma.class.upsert({
    where: { name: 'Grade 3' },
    update: {},
    create: {
      name: 'Grade 3',
      description: 'Third grade students',
    },
  })
  console.log('🏫 Created classes: Grade 1, Grade 2, Grade 3')

  // Create sections for each class
  const sections = ['A', 'B']
  for (const className of ['Grade 1', 'Grade 2', 'Grade 3']) {
    const classRecord = await prisma.class.findUnique({ where: { name: className } })
    if (classRecord) {
      for (const sectionName of sections) {
        await prisma.section.upsert({
          where: {
            classId_name: {
              classId: classRecord.id,
              name: sectionName
            }
          },
          update: {},
          create: {
            name: sectionName,
            classId: classRecord.id,
          },
        })
      }
    }
  }
  console.log('📚 Created sections A and B for each class')

  // Create subjects
  const subjects = [
    { name: 'Mathematics', code: 'MATH', teacherId: teacher.id, classId: grade1.id },
    { name: 'English', code: 'ENG', teacherId: teacher2.id, classId: grade1.id },
    { name: 'Science', code: 'SCI', teacherId: teacher.id, classId: grade2.id },
    { name: 'History', code: 'HIST', teacherId: teacher2.id, classId: grade2.id },
  ]

  for (const subject of subjects) {
    await prisma.subject.upsert({
      where: { code: subject.code },
      update: {},
      create: subject,
    })
  }
  console.log('📖 Created subjects')

  // Create sample students
  const sampleStudents = [
    {
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice.johnson@student.school.com',
      dateOfBirth: new Date('2015-03-15'),
      fatherName: 'Robert Johnson',
      motherName: 'Mary Johnson',
      guardianPhone: '+1234567892',
      address: '789 Student Lane',
      classId: grade1.id,
      rollNo: '001',
    },
    {
      firstName: 'Bob',
      lastName: 'Williams',
      email: 'bob.williams@student.school.com',
      dateOfBirth: new Date('2015-07-22'),
      fatherName: 'David Williams',
      motherName: 'Sarah Williams',
      guardianPhone: '+1234567893',
      address: '321 Student Road',
      classId: grade1.id,
      rollNo: '002',
    },
    {
      firstName: 'Charlie',
      lastName: 'Brown',
      dateOfBirth: new Date('2014-11-08'),
      fatherName: 'Michael Brown',
      motherName: 'Lisa Brown',
      guardianPhone: '+1234567894',
      address: '654 Student Street',
      classId: grade2.id,
      rollNo: '003',
    },
    {
      firstName: 'Diana',
      lastName: 'Davis',
      email: 'diana.davis@student.school.com',
      dateOfBirth: new Date('2013-09-12'),
      fatherName: 'James Davis',
      motherName: 'Patricia Davis',
      guardianPhone: '+1234567895',
      address: '987 Student Boulevard',
      classId: grade3.id,
      rollNo: '004',
    },
  ]

  // Get first section for each class
  const grade1SectionA = await prisma.section.findFirst({
    where: { classId: grade1.id, name: 'A' }
  })
  const grade2SectionA = await prisma.section.findFirst({
    where: { classId: grade2.id, name: 'A' }
  })
  const grade3SectionA = await prisma.section.findFirst({
    where: { classId: grade3.id, name: 'A' }
  })

  // Generate admission numbers and create students
  for (let i = 0; i < sampleStudents.length; i++) {
    const studentData = sampleStudents[i]
    const admissionNo = `2024${(i + 1).toString().padStart(4, '0')}`
    
    let sectionId = null
    if (studentData.classId === grade1.id) sectionId = grade1SectionA?.id
    if (studentData.classId === grade2.id) sectionId = grade2SectionA?.id
    if (studentData.classId === grade3.id) sectionId = grade3SectionA?.id

    const student = await prisma.student.upsert({
      where: { admissionNo },
      update: {
        ...studentData,
        sectionId,
        isActive: true,
      },
      create: {
        ...studentData,
        admissionNo,
        sectionId,
        admissionDate: new Date(),
        isActive: true,
      },
    })

    // Create some sample attendance records for the past week
    const today = new Date()
    for (let day = 0; day < 7; day++) {
      const attendanceDate = new Date(today)
      attendanceDate.setDate(today.getDate() - day)
      
      // Skip weekends
      if (attendanceDate.getDay() === 0 || attendanceDate.getDay() === 6) continue

      const statuses = ['PRESENT', 'PRESENT', 'PRESENT', 'PRESENT', 'ABSENT', 'LATE']
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]

      await prisma.attendance.upsert({
        where: {
          studentId_date: {
            studentId: student.id,
            date: attendanceDate,
          },
        },
        update: {
          status: randomStatus as any,
          notes: randomStatus === 'LATE' ? 'Traffic delay' : '',
        },
        create: {
          studentId: student.id,
          date: attendanceDate,
          status: randomStatus as any,
          notes: randomStatus === 'LATE' ? 'Traffic delay' : '',
        },
      })
    }
  }
  console.log('👥 Created sample students with attendance records')

  console.log('✅ Database seeding completed successfully!')
  console.log('\n📝 Demo Credentials:')
  console.log('Admin: admin@school.com / admin123')
  console.log('Teacher: teacher@school.com / teacher123')
  console.log('Teacher 2: jane.teacher@school.com / teacher123')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })