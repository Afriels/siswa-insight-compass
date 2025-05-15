
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const activities = [
  {
    id: 1,
    student: "Ahmad Fauzi",
    activity: "Konseling individu",
    issue: "Kesulitan akademik",
    date: "15 Mei 2025"
  },
  {
    id: 2,
    student: "Siti Nurhaliza",
    activity: "Konseling kelompok",
    issue: "Sosialisasi",
    date: "14 Mei 2025"
  },
  {
    id: 3,
    student: "Budi Santoso",
    activity: "Observasi kelas",
    issue: "Perilaku di kelas",
    date: "13 Mei 2025"
  },
  {
    id: 4,
    student: "Dewi Lestari",
    activity: "Mediasi konflik",
    issue: "Hubungan teman sebaya",
    date: "12 Mei 2025"
  },
  {
    id: 5,
    student: "Rudi Hermawan",
    activity: "Konseling karier",
    issue: "Pemilihan jurusan",
    date: "11 Mei 2025"
  },
];

export function RecentActivities() {
  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Aktivitas Terbaru</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4 rounded-lg border p-3">
              <div className="flex-1 space-y-1">
                <p className="font-medium">{activity.student}</p>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{activity.activity} - {activity.issue}</span>
                  <span>{activity.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
