// Simpan Produk ke localStorage
function simpanProduk() {
    let nama = document.getElementById("produk_nama").value.trim();
    let stok = parseInt(document.getElementById("produk_stok").value, 10);
    let harga = parseInt(document.getElementById("produk_harga").value, 10);

    if (!nama || isNaN(stok) || isNaN(harga) || stok < 0 || harga < 0) {
        alert("Harap isi data produk dengan benar.");
        return;
    }

    let produk = JSON.parse(localStorage.getItem("produk")) || [];
    produk.push({ nama, stok, harga });
    localStorage.setItem("produk", JSON.stringify(produk));

    alert("Produk berhasil disimpan!");
    muatLaporanProduk();
}

// Simpan Pelanggan ke localStorage
function simpanPelanggan() {
    let nama = document.getElementById("pelanggan_nama").value.trim();
    let telepon = document.getElementById("pelanggan_telepon").value.trim();

    if (!nama || !telepon) {
        alert("Harap isi data pelanggan dengan benar.");
        return;
    }

    let pelanggan = JSON.parse(localStorage.getItem("pelanggan")) || [];
    pelanggan.push({ nama, telepon });
    localStorage.setItem("pelanggan", JSON.stringify(pelanggan));

    alert("Pelanggan berhasil disimpan!");
    muatLaporanPelanggan();
}

// Simpan Transaksi ke localStorage
function simpanTransaksi() {
    let pelanggan = document.getElementById("namaPelanggan").value.trim();
    let namaProduk = document.getElementById("produkTerpilih").value.trim();
    let jumlah = parseInt(document.getElementById("jumlahBeli").value, 10);
    let tanggal = new Date().toISOString().split("T")[0];

    if (!pelanggan || !namaProduk || isNaN(jumlah) || jumlah <= 0) {
        alert("Harap isi semua data transaksi dengan benar.");
        return;
    }

    let produk = JSON.parse(localStorage.getItem("produk")) || [];
    let barang = produk.find(p => p.nama.toLowerCase() === namaProduk.toLowerCase());

    if (!barang) {
        alert("Produk tidak ditemukan.");
        return;
    }

    if (barang.stok < jumlah) {
        alert("Stok tidak mencukupi untuk transaksi ini.");
        return;
    }

    barang.stok -= jumlah;
    localStorage.setItem("produk", JSON.stringify(produk));

    let hargaTotal = barang.harga * jumlah;
    let transaksi = JSON.parse(localStorage.getItem("transaksi")) || [];
    transaksi.push({ pelanggan, produk: namaProduk, jumlah, hargaTotal, tanggal });
    localStorage.setItem("transaksi", JSON.stringify(transaksi));

    alert("Transaksi berhasil disimpan!");
    muatLaporanTransaksi();
}

// Tampilkan Laporan Produk
function muatLaporanProduk() {
    let produk = JSON.parse(localStorage.getItem("produk")) || [];
    let tabel = document.getElementById("tabel_produk");

    tabel.innerHTML = `<tr><th>Nama Produk</th><th>Stok</th><th>Harga</th></tr>`;
    produk.forEach(p => {
        let row = tabel.insertRow();
        row.insertCell(0).innerText = p.nama;
        row.insertCell(1).innerText = p.stok;
        row.insertCell(2).innerText = `Rp${p.harga.toLocaleString()}`;
    });
}

// Tampilkan Laporan Pelanggan
function muatLaporanPelanggan() {
    let pelanggan = JSON.parse(localStorage.getItem("pelanggan")) || [];
    let tabel = document.getElementById("tabel_pelanggan");

    tabel.innerHTML = `<tr><th>Nama</th><th>No. Telepon</th></tr>`;
    pelanggan.forEach(p => {
        let row = tabel.insertRow();
        row.insertCell(0).innerText = p.nama;
        row.insertCell(1).innerText = p.telepon;
    });
}

// Tampilkan Laporan Transaksi
function muatLaporanTransaksi() {
    let transaksi = JSON.parse(localStorage.getItem("transaksi")) || [];
    let tabel = document.getElementById("tabel_transaksi");

    tabel.innerHTML = `<tr><th>Tanggal</th><th>Pelanggan</th><th>Produk</th><th>Jumlah</th><th>Total Harga</th></tr>`;
    transaksi.forEach(t => {
        let row = tabel.insertRow();
        row.insertCell(0).innerText = t.tanggal;
        row.insertCell(1).innerText = t.pelanggan;
        row.insertCell(2).innerText = t.produk;
        row.insertCell(3).innerText = t.jumlah;
        row.insertCell(4).innerText = `Rp${t.hargaTotal.toLocaleString()}`;
    });
}

// Tampilkan Rekapitulasi Penjualan Per Hari
function muatRekapHarian() {
    let transaksi = JSON.parse(localStorage.getItem("transaksi")) || [];
    let tabel = document.getElementById("tabel_rekap");
    let totalPerHari = {};

    transaksi.forEach(t => {
        if (!totalPerHari[t.tanggal]) {
            totalPerHari[t.tanggal] = 0;
        }
        totalPerHari[t.tanggal] += t.hargaTotal;
    });

    tabel.innerHTML = `<tr><th>Tanggal</th><th>Total Penjualan</th></tr>`;
    for (let tanggal in totalPerHari) {
        let row = tabel.insertRow();
        row.insertCell(0).innerText = tanggal;
        row.insertCell(1).innerText = `Rp${totalPerHari[tanggal].toLocaleString()}`;
    }
}

// Tampilkan Rekapitulasi Penjualan Per Bulan
function muatRekapBulanan() {
    let transaksi = JSON.parse(localStorage.getItem("transaksi")) || [];
    let tabel = document.getElementById("tabel_rekap");
    let totalPerBulan = {};

    transaksi.forEach(t => {
        let bulan = t.tanggal.substring(0, 7); // Ambil YYYY-MM

        if (!totalPerBulan[bulan]) {
            totalPerBulan[bulan] = 0;
        }
        totalPerBulan[bulan] += t.hargaTotal;
    });

    tabel.innerHTML = `<tr><th>Bulan</th><th>Total Penjualan</th></tr>`;
    for (let bulan in totalPerBulan) {
        let row = tabel.insertRow();
        row.insertCell(0).innerText = bulan;
        row.insertCell(1).innerText = `Rp${totalPerBulan[bulan].toLocaleString()}`;
    }
}

// Tampilkan Rekapitulasi Penjualan Per Tahun
function muatRekapTahunan() {
    let transaksi = JSON.parse(localStorage.getItem("transaksi")) || [];
    let tabel = document.getElementById("tabel_rekap");
    let totalPerTahun = {};

    transaksi.forEach(t => {
        let tahun = t.tanggal.substring(0, 4); // Ambil YYYY

        if (!totalPerTahun[tahun]) {
            totalPerTahun[tahun] = 0;
        }
        totalPerTahun[tahun] += t.hargaTotal;
    });

    tabel.innerHTML = `<tr><th>Tahun</th><th>Total Penjualan</th></tr>`;
    for (let tahun in totalPerTahun) {
        let row = tabel.insertRow();
        row.insertCell(0).innerText = tahun;
        row.insertCell(1).innerText = `Rp${totalPerTahun[tahun].toLocaleString()}`;
    }
}

// Hapus Semua Data
function hapusData() {
    localStorage.clear();
    alert("Semua data telah dihapus!");
    location.reload();
}

// Panggil fungsi sesuai halaman yang dibuka
window.onload = function() {
    if (document.getElementById("tabel_produk")) muatLaporanProduk();
    if (document.getElementById("tabel_pelanggan")) muatLaporanPelanggan();
    if (document.getElementById("tabel_transaksi")) muatLaporanTransaksi();
    if (document.getElementById("tabel_rekap")) {
        if (document.title.includes("Harian")) muatRekapHarian();
        if (document.title.includes("Bulanan")) muatRekapBulanan();
        if (document.title.includes("Tahunan")) muatRekapTahunan();
    }
};

document.addEventListener("DOMContentLoaded", function() {
    if (document.title.includes("Transaksi")) {
        muatLaporanTransaksi(); // Muat transaksi jika di transaksi.html
    }
});

// 🔍 **Fungsi Pencarian Produk**
function cariProduk() {
    let namaProduk = document.getElementById("cari_produk").value.toLowerCase();
    let produk = JSON.parse(localStorage.getItem("produk")) || [];
    let hasil = produk.find(p => p.nama.toLowerCase() === namaProduk);

    let hasilElement = document.getElementById("hasil_cari");
    if (hasil) {
        hasilElement.innerHTML = `Produk: ${hasil.nama} <br> Stok: ${hasil.stok} <br> Harga: Rp${hasil.harga}`;
    } else {
        hasilElement.innerHTML = "Produk tidak ditemukan.";
    }
}

// 🛒 **Fungsi Simpan Transaksi**
function simpanTransaksi() {
    let pelanggan = document.getElementById("trans_pelanggan").value.trim();
    let namaProduk = document.getElementById("trans_produk").value.trim();
    let jumlah = parseInt(document.getElementById("trans_jumlah").value, 10);
    let tanggal = new Date().toISOString().split("T")[0]; // Format YYYY-MM-DD

    if (!pelanggan || !namaProduk || isNaN(jumlah) || jumlah <= 0) {
        alert("Harap isi semua data transaksi dengan benar.");
        return;
    }

    let produk = JSON.parse(localStorage.getItem("produk")) || [];
    let barang = produk.find(p => p.nama.toLowerCase() === namaProduk.toLowerCase());

    if (!barang) {
        alert("Produk tidak ditemukan.");
        return;
    }

    if (barang.stok < jumlah) {
        alert("Stok tidak mencukupi untuk transaksi ini.");
        return;
    }

    // Kurangi stok produk
    barang.stok -= jumlah;
    localStorage.setItem("produk", JSON.stringify(produk));

    // Hitung total harga transaksi
    let hargaTotal = barang.harga * jumlah;

    // Simpan transaksi ke localStorage
    let transaksi = JSON.parse(localStorage.getItem("transaksi")) || [];
    transaksi.push({
        pelanggan: pelanggan,
        produk: namaProduk,
        jumlah: jumlah,
        hargaTotal: hargaTotal,
        tanggal: tanggal
    });
    localStorage.setItem("transaksi", JSON.stringify(transaksi));

    alert("Transaksi berhasil disimpan!");
    muatLaporanTransaksi(); // Perbarui tampilan transaksi
}

// 📄 **Fungsi Menampilkan Data Transaksi**
function muatLaporanTransaksi() {
    let transaksi = JSON.parse(localStorage.getItem("transaksi")) || [];
    let hasilElement = document.getElementById("hasil_transaksi");

    let html = `<h2>Data Transaksi</h2>`;
    if (transaksi.length === 0) {
        html += `<p>Belum ada transaksi.</p>`;
    } else {
        html += `<table border="1">
            <tr>
                <th>Tanggal</th>
                <th>Nama Pelanggan</th>
                <th>Produk</th>
                <th>Jumlah</th>
                <th>Total Harga</th>
            </tr>`;

        transaksi.forEach(t => {
            html += `<tr>
                <td>${t.tanggal}</td>
                <td>${t.pelanggan}</td>
                <td>${t.produk}</td>
                <td>${t.jumlah}</td>
                <td>Rp${t.hargaTotal.toLocaleString()}</td>
            </tr>`;
        });

        html += `</table>`;
    }

    hasilElement.innerHTML = html; // Tampilkan di bawah transaksi
}
