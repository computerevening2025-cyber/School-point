using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace ScoreApp
{
    public class StudentInfo
    {
        public string studentId { get; set; } = "";
        public string name { get; set; } = "";
        public string nickname { get; set; } = "";
    }

    class Program
    {
        private static string firebaseUrl = "https://classscorem3-default-rtdb.firebaseio.com";

        static async Task Main(string[] args)
        {
            Console.OutputEncoding = Encoding.UTF8;
            Console.InputEncoding = Encoding.UTF8;

            string[] subjects = new string[]
            {
                "ພາສາລາວ-ວັນນະຄະດີ",
                "ຄະນິດສາດ",
                "ວິທະຍາສາດທຳມະຊາດ",
                "ພູມສາດ",
                "ປະຫວັດສາດ",
                "ສຶກສາພົນລະເມືອງ",
                "ຄອມພິວເຕີ້",
                "ພື້ນຖານວິຊາຊີບ",
                "ພາສາອັງກິດ",
                "ສິລະປະກຳ",
                "ສິລະປະດົນຕີ",
                "ພະລະສຶກສາ"
            };

            using (HttpClient client = new HttpClient())
            {
                while (true)
                {
                    Console.WriteLine("\n====================================");
                    Console.WriteLine("    ລະບົບບັນທຶກຄະແນນປະຈຳເດືອນ (C#)");
                    Console.WriteLine("====================================");

                    Console.Write("ເລືອກເດືອນ (ເຊັ່ນ: 9, 10, 11, 12): ");
                    string month = Console.ReadLine()?.Trim() ?? "1";
                    string monthKey = "month_" + month; // เช่น month_9

                    Console.Write("ລະຫັດ: ");
                    string id = Console.ReadLine()?.Trim() ?? "";

                    Console.Write("ຊື່ ແລະ ນາມສະກຸນ: ");
                    string name = Console.ReadLine()?.Trim() ?? "";

                    Console.Write("ຊື່ຫຼິ້ນ: ");
                    string nickname = Console.ReadLine()?.Trim() ?? "";

                    // 1. บันทึกข้อมูลส่วนตัวนักเรียน
                    var studentInfo = new StudentInfo { studentId = id, name = name, nickname = nickname };
                    string infoJson = JsonSerializer.Serialize(studentInfo);
                    await client.PatchAsync($"{firebaseUrl}/students/{id}.json", new StringContent(infoJson, Encoding.UTF8, "application/json"));

                    // 2. ป้อนและบันทึกคะแนนประจำเดือนนั้น
                    var monthScores = new Dictionary<string, double>();
                    Console.WriteLine($"\n--- ປ້ອນຄະແນນ ປະຈຳເດືອນ {month} ---");
                    foreach (var sub in subjects)
                    {
                        Console.Write($"{sub}: ");
                        double.TryParse(Console.ReadLine()?.Trim(), out double score);
                        monthScores[sub] = score;
                    }

                    string scoreJson = JsonSerializer.Serialize(monthScores);
                    HttpResponseMessage response = await client.PutAsync($"{firebaseUrl}/students/{id}/months/{monthKey}/scores.json", new StringContent(scoreJson, Encoding.UTF8, "application/json"));

                    if (response.IsSuccessStatusCode)
                    {
                        Console.WriteLine($"\n🎉 ບັນທຶກຄະແນນເດືອນ {month} ຂອງ [{name}] ສຳເລັດແລ້ວ!");
                    }
                    else
                    {
                        Console.WriteLine($"\n❌ ເກີດຂໍ້ຜິດພາດ: {response.StatusCode}");
                    }

                    Console.Write("\nຕ້ອງການປ້ອນຄົນຕໍ່ໄປບໍ? (y/n): ");
                    if (Console.ReadLine()?.ToLower() != "y") break;
                }
            }
        }
    }
}