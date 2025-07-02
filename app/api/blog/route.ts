import { type NextRequest, NextResponse } from "next/server"

// Mock data storage
const posts = [
  {
    id: "1",
    title: "Update Pasar Real Estat Q1 2024",
    content:
      "<h2>Gambaran Pasar</h2><p>Pasar real estat terus menunjukkan <strong>performa yang kuat</strong> di kuartal pertama 2024. Sorotan utama meliputi:</p><ul><li>Harga rumah rata-rata naik 8,5%</li><li>Hari di pasar turun menjadi 22 hari</li><li>Tingkat inventori tetap rendah di 2,1 bulan pasokan</li></ul><p>Tren ini menunjukkan <em>pasar penjual yang kuat</em> dengan permintaan pembeli yang berkelanjutan.</p><h3>Analisis Regional</h3><p>Area pusat kota mengalami tingkat apresiasi tertinggi, sementara pasar suburban menunjukkan pertumbuhan yang stabil.</p>",
    author: "Sarah Johnson",
    category: "market_update" as const,
    status: "published" as const,
    publishDate: "2024-01-15",
    views: 1250,
    tags: ["tren pasar", "Q1 2024", "real estat"],
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    title: "Apartemen Pusat Kota yang Menakjubkan Kini Tersedia",
    content:
      '<h2>Hunian Premium di Jantung Kota</h2><p>Temukan <strong>apartemen 2 kamar tidur yang indah</strong> ini di jantung pusat kota dengan pemandangan kota yang menakjubkan dan fasilitas modern.</p><h3>Fitur Termasuk:</h3><ul><li>Jendela dari lantai ke langit-langit</li><li>Countertop granit</li><li>Peralatan stainless steel</li><li>Mesin cuci/pengering dalam unit</li><li>Balkon dengan pemandangan kota</li></ul><p>Properti ini mewakili <em>perpaduan sempurna antara kemewahan dan kenyamanan</em>, terletak hanya beberapa langkah dari pusat perbelanjaan, restoran, dan hiburan.</p><blockquote>"Apartemen ini menawarkan gaya hidup urban terbaik dengan kenyamanan dan gaya yang tak tertandingi."</blockquote>',
    author: "Mike Chen",
    category: "property_showcase" as const,
    status: "published" as const,
    publishDate: "2024-01-20",
    views: 890,
    tags: ["pusat kota", "apartemen", "mewah"],
    createdAt: "2024-01-20T14:15:00Z",
  },
  {
    id: "3",
    title: "Panduan Lengkap Pembeli Rumah Pertama",
    content:
      "<h2>Perjalanan Anda Menuju Kepemilikan Rumah Dimulai Di Sini</h2><p>Membeli rumah pertama Anda adalah pencapaian yang menggembirakan! Panduan komprehensif ini akan memandu Anda melalui setiap langkah prosesnya.</p><h3>Memulai</h3><ol><li><strong>Evaluasi situasi keuangan Anda</strong></li><li><strong>Dapatkan pra-persetujuan untuk hipotek</strong></li><li><strong>Tentukan anggaran Anda</strong></li><li><strong>Mulai berburu rumah</strong></li></ol><p>Ingat, persiapan adalah kunci untuk pembelian rumah yang sukses. Luangkan waktu untuk memahami setiap langkah dan jangan ragu untuk bertanya.</p>",
    author: "Lisa Rodriguez",
    category: "tips_guides" as const,
    status: "draft" as const,
    publishDate: "2024-02-01",
    views: 0,
    tags: ["pembeli pertama", "panduan", "tips"],
    createdAt: "2024-01-25T09:45:00Z",
  },
]

// GET - Fetch all posts
export async function GET() {
  return NextResponse.json(posts)
}

// POST - Create new post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newPost = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
    }
    posts.push(newPost)
    return NextResponse.json(newPost, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}
