'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Pencil, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { motion } from "framer-motion"
import { ThemeProvider } from 'next-themes'
import { ThemeToggle } from "@/components/theme-toggle"

// Define the structure for a grade
interface Grade {
  assignment: string
  score: number
  weight: number
}

// Define the structure for a subject
interface Subject {
  name: string
  grades: Grade[]
}

// Rename the initial data array
const initialSubjects: Subject[] = [
  {
    name: "Mathematics",
    grades: [
      { assignment: "Midterm", score: 5.2, weight: 0.3 },
      { assignment: "Final", score: 5.7, weight: 0.5 },
      { assignment: "Homework", score: 5.9, weight: 0.2 },
    ],
  },
  {
    name: "Science",
    grades: [
      { assignment: "Lab Report", score: 5.4, weight: 0.4 },
      { assignment: "Final Exam", score: 5.8, weight: 0.6 },
    ],
  },
  {
    name: "History",
    grades: [
      { assignment: "Essay", score: 4.6, weight: 0.3 },
      { assignment: "Presentation", score: 5.2, weight: 0.3 },
      { assignment: "Final Exam", score: 5.4, weight: 0.4 },
    ],
  },
]

export default function GradesPage() {
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects || [])
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null)
  const [newGrade, setNewGrade] = useState<Grade>({
    assignment: "",
    score: 0,
    weight: 0,
  })
  const [editingValues, setEditingValues] = useState<Grade | null>(null)

  // Calculate the total grade for a subject
  const calculateTotalGrade = (grades: Grade[]) => {
    if (!grades.length) return 0;
    const total = grades.reduce((total, grade) => total + grade.score * grade.weight, 0)
    return Math.round(total * 2) / 2 // Round to nearest 0.5
  }

  // Calculate the overall average grade
  const calculateOverallAverage = () => {
    if (!subjects.length) return 0;
    const totalGrades = subjects.reduce((sum, subject) => {
      const grade = calculateTotalGrade(subject.grades);
      return sum + (isNaN(grade) ? 0 : grade);
    }, 0)
    return Math.round((totalGrades / subjects.length) * 10) / 10 // Round to nearest 0.1
  }

  // Calculate the percentage (out of 100) for a 1-6 scale grade
  const calculatePercentage = (grade: number) => {
    if (isNaN(grade) || grade < 1) return 0;
    return Math.min(100, Math.max(0, ((grade - 1) / 5) * 100));
  }

  const addGrade = (subjectName: string) => {
    setSubjects(subjects.map(subject => {
      if (subject.name === subjectName) {
        return {
          ...subject,
          grades: [...subject.grades, newGrade]
        }
      }
      return subject
    }))
    setNewGrade({ assignment: "", score: 0, weight: 0 })
  }

  const updateGrade = (subjectName: string, updatedGrade: Grade, index: number) => {
    setSubjects(subjects.map(subject => {
      if (subject.name === subjectName) {
        const newGrades = [...subject.grades]
        newGrades[index] = updatedGrade
        return {
          ...subject,
          grades: newGrades
        }
      }
      return subject
    }))
  }

  const deleteGrade = (subjectName: string, index: number) => {
    setSubjects(subjects.map(subject => {
      if (subject.name === subjectName) {
        const newGrades = subject.grades.filter((_, i) => i !== index)
        return {
          ...subject,
          grades: newGrades
        }
      }
      return subject
    }))
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="container mx-auto py-12 px-4">
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>
        <motion.h1 
          className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          My Awesome Grades
        </motion.h1>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject, index) => (
            <motion.div
              key={subject.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card 
                className="overflow-hidden transition-shadow hover:shadow-lg cursor-pointer"
                onClick={() => setSelectedSubject(subject)}
              >
                <CardHeader>
                  <CardTitle>{subject.name}</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Grade:</span>
                    <span className="text-2xl font-bold">
                      {isNaN(calculateTotalGrade(subject.grades)) ? '0' : calculateTotalGrade(subject.grades)}
                    </span>
                  </div>
                  <Progress value={calculatePercentage(calculateTotalGrade(subject.grades))} className="h-2" />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="mt-12 overflow-hidden">
            <CardHeader>
              <CardTitle>Overall Grade Average</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Average:</span>
                <span className="text-3xl font-bold">
                  {isNaN(calculateOverallAverage()) ? '0' : calculateOverallAverage()}
                </span>
              </div>
              <Progress value={calculatePercentage(calculateOverallAverage())} className="h-3" />
            </CardContent>
          </Card>
        </motion.div>
        {selectedSubject && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mt-8">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{selectedSubject.name} Details</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" className="ml-auto">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Grade
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Grade</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Input
                          placeholder="Assignment name"
                          value={newGrade.assignment}
                          onChange={(e) => setNewGrade({ ...newGrade, assignment: e.target.value })}
                        />
                        <Input
                          type="number"
                          placeholder="Score (1-6)"
                          min="1"
                          max="6"
                          step="0.1"
                          value={newGrade.score}
                          onChange={(e) => setNewGrade({ ...newGrade, score: parseFloat(e.target.value) })}
                        />
                        <Input
                          type="number"
                          placeholder="Weight (0-1)"
                          min="0"
                          max="1"
                          step="0.1"
                          value={newGrade.weight}
                          onChange={(e) => setNewGrade({ ...newGrade, weight: parseFloat(e.target.value) })}
                        />
                      </div>
                      <Button onClick={() => addGrade(selectedSubject.name)}>Add Grade</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Assignment</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Weight</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedSubject.grades.map((grade, index) => (
                      <TableRow key={index}>
                        {editingGrade === grade ? (
                          <>
                            <TableCell>
                              <Input
                                value={editingValues?.assignment || ''}
                                onChange={(e) => {
                                  setEditingValues({ ...editingValues!, assignment: e.target.value })
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={editingValues?.score || 0}
                                min="1"
                                max="6"
                                step="0.1"
                                onChange={(e) => {
                                  setEditingValues({ ...editingValues!, score: parseFloat(e.target.value) })
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={editingValues?.weight || 0}
                                min="0"
                                max="1"
                                step="0.1"
                                onChange={(e) => {
                                  setEditingValues({ ...editingValues!, weight: parseFloat(e.target.value) })
                                }}
                              />
                            </TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell>{grade.assignment}</TableCell>
                            <TableCell>{grade.score}</TableCell>
                            <TableCell>{grade.weight * 100}%</TableCell>
                          </>
                        )}
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => {
                                if (editingGrade === grade) {
                                  // Save changes
                                  updateGrade(selectedSubject.name, editingValues!, index)
                                  setEditingGrade(null)
                                  setEditingValues(null)
                                } else {
                                  // Start editing
                                  setEditingGrade(grade)
                                  setEditingValues({ ...grade })
                                }
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => deleteGrade(selectedSubject.name, index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </ThemeProvider>
  )
}

