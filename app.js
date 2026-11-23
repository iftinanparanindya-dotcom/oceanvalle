// ==========================================
// OCEANVALLE LIBRARY
// Katalog, anggota, sirkulasi, dan admin
// ==========================================

const STORAGE = {
  books: "oceanvalle_books",
  members: "oceanvalle_members",
  loans: "oceanvalle_loans",
  session: "oceanvalle_session",
  password: "oceanvalle_admin_password",
  catalogVersion: "oceanvalle_catalog_version",
  admins: "oceanvalle_admin_accounts"
};

// ==========================================
// DATA 10 EBOOK OCEANVALLE
// Lokasi PDF: assets/ebooks/
// ==========================================

const STARTER_BOOKS = [
  {
    id: "book-1",
    title: "A Game of Ghosts",
    author: "John Connolly",
    category: "Fiction",
    year: 2017,
    publisher: "Hodder & Stoughton",
    stock: 2,
    available: 2,
    ebookUrl: "assets/ebooks/a-game-of-ghost.pdf"
  },
  {
    id: "book-2",
    title: "Steelheart",
    author: "Brandon Sanderson",
    category: "Fantasy",
    year: 2013,
    publisher: "Delacorte Press",
    stock: 2,
    available: 2,
    ebookUrl: "assets/ebooks/steelheart.pdf"
  },
  {
    id: "book-3",
    title: "Calamity",
    author: "Brandon Sanderson",
    category: "Fantasy",
    year: 2016,
    publisher: "Delacorte Press",
    stock: 2,
    available: 2,
    ebookUrl: "assets/ebooks/calamity.pdf"
  },
  {
    id: "book-4",
    title: "MADILOG",
    author: "Tan Malaka",
    category: "Nonfiksi",
    year: 1943,
    publisher: "",
    stock: 2,
    available: 2,
    ebookUrl: "assets/ebooks/madilog.pdf"
  },
  {
    id: "book-5",
    title: "Gadis Kretek",
    author: "Ratih Kumala",
    category: "Fiction",
    year: 2012,
    publisher: "Gramedia Pustaka Utama",
    stock: 2,
    available: 2,
    ebookUrl: "assets/ebooks/gadis-kretek.pdf"
  },
  {
    id: "book-6",
    title: "Sang Alkemis",
    author: "Paulo Coelho",
    category: "Fiction",
    year: 1988,
    publisher: "",
    stock: 2,
    available: 2,
    ebookUrl: "assets/ebooks/sang-alkemis.pdf"
  },
  {
    id: "book-7",
    title: "Serbuk Bintang (Stardust)",
    author: "Neil Gaiman",
    category: "Fantasy",
    year: 1999,
    publisher: "",
    stock: 2,
    available: 2,
    ebookUrl: "assets/ebooks/serbuk-bintang.pdf"
  },
  {
    id: "book-8",
    title: "Legend",
    author: "Marie Lu",
    category: "Dystopian",
    year: 2011,
    publisher: "",
    stock: 2,
    available: 2,
    ebookUrl: "assets/ebooks/legend.pdf"
  },
  {
    id: "book-9",
    title: "Pergi",
    author: "Tere Liye",
    category: "Fiction",
    year: 2018,
    publisher: "",
    stock: 2,
    available: 2,
    ebookUrl: "assets/ebooks/pergi.pdf"
  },
  {
    id: "book-10",
    title: "Pulang",
    author: "Tere Liye",
    category: "Fiction",
    year: 2015,
    publisher: "",
    stock: 2,
    available: 2,
    ebookUrl: "assets/ebooks/pulang.pdf"
  }
];

// ==========================================
// FUNGSI PENYIMPANAN DATA
// ==========================================

function loadData(key, fallback) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (error) {
    console.error("Gagal membaca data:", error);
    return fallback;
  }
}

function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function saveBooks() {
  saveData(STORAGE.books, books);
}

function saveMembers() {
  saveData(STORAGE.members, members);
}

function saveLoans() {
  saveData(STORAGE.loans, loans);
}

function saveAdmins() {
  saveData(STORAGE.admins, admins);
}

function makeId(prefix) {
  return prefix + "-" + Date.now() + "-" +
    Math.floor(Math.random() * 1000);
}

// ==========================================
// INISIALISASI DATA
// ==========================================

let books = loadData(STORAGE.books, STARTER_BOOKS);
let members = loadData(STORAGE.members, []);
let loans = loadData(STORAGE.loans, []);

if (!Array.isArray(books)) books = STARTER_BOOKS;
if (!Array.isArray(members)) members = [];
if (!Array.isArray(loans)) loans = [];

// Inisialisasi akun admin.
// Password admin utama tetap mengikuti password lama.

let admins = loadData(STORAGE.admins, []);

if (!Array.isArray(admins)) admins = [];

const oldAdminPassword =
  localStorage.getItem(STORAGE.password) || "ocean123";

if (!admins.some(admin => admin.username === "admin")) {
  admins.unshift({
    id: "admin-main",
    username: "admin",
    password: oldAdminPassword,
    isMain: true
  });
}

saveAdmins();

// Perbarui alamat PDF buku bawaan tanpa menghapus
// data anggota dan peminjaman.

books = books.map(book => {
  const starterBook = STARTER_BOOKS.find(
    item => item.id === book.id
  );

  if (starterBook) {
    return {
      ...book,
      ebookUrl: starterBook.ebookUrl
    };
  }

  return book;
});

saveBooks();
localStorage.setItem(STORAGE.catalogVersion, "3");

// ==========================================
// FUNGSI BANTUAN
// ==========================================

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, function(char) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[char];
  });
}

function todayString() {
  const date = new Date();

  const localDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000
  );

  return localDate.toISOString().slice(0, 10);
}

function getEbookUrl(path) {
  if (!path) return "";

  const cleanPath = String(path).trim();

  if (/^https?:\/\//i.test(cleanPath)) {
    return cleanPath;
  }

  return new URL(
    cleanPath.replace(/^\/+/, ""),
    window.location.href
  ).href;
}

// ==========================================
// FITUR BARCODE
// ==========================================

// Kode barcode buku dan anggota menggunakan ID unik.

function getBookBarcode(book) {
  return "OVB" + String(book.id).replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
}

function getMemberBarcode(member) {
  return "OVM" + String(member.id).replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
}

function createBarcodeSvg(value, className = "print-barcode") {
  if (typeof JsBarcode === "undefined") {
    alert("Library barcode belum berhasil dimuat. Periksa koneksi internet.");
    return "";
  }

  const svg = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );

  try {
    JsBarcode(svg, value, {
      format: "CODE128",
      lineColor: "#111111",
      background: "#ffffff",
      width: 2,
      height: 45,
      displayValue: true,
      fontSize: 12,
      margin: 4
    });

    svg.setAttribute("class", className);

    return svg.outerHTML;
  } catch (error) {
    console.error("Gagal membuat barcode:", error);
    return "";
  }
}

function openPrintWindow(content, title) {
  const printWindow = window.open("", "_blank");

  if (!printWindow) {
    alert("Pop-up diblokir browser. Izinkan pop-up untuk mencetak.");
    return;
  }

  printWindow.document.open();

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>${escapeHTML(title)}</title>
      <style>
        * { box-sizing: border-box; }
        body {
          margin: 20px;
          color: #222;
          font-family: Arial, sans-serif;
        }
        h1, h2, h3 { color: #222; }
        .print-header {
          text-align: center;
          border-bottom: 2px solid #775537;
          padding-bottom: 15px;
          margin-bottom: 25px;
        }
        .print-table {
          width: 100%;
          border-collapse: collapse;
        }
        .print-table th, .print-table td {
          border: 1px solid #999;
          padding: 8px;
          font-size: 11px;
          text-align: left;
        }
        .print-table th { background: #eee; }
        .print-barcode {
          width: 145px;
          height: 48px;
        }
        .member-card-print {
          width: 350px;
          min-height: 210px;
          border: 2px solid #775537;
          border-radius: 12px;
          padding: 18px;
          margin: 15px auto;
          background: #F7F5EF;
          page-break-inside: avoid;
        }
        .member-card-print h2 {
          margin: 0 0 5px;
          font-size: 20px;
        }
        .member-card-brand {
          font-size: 10px;
          letter-spacing: 2px;
          color: #775537;
          font-weight: bold;
        }
        .member-card-name {
          font-size: 17px;
          font-weight: bold;
          margin-top: 18px;
        }
        .member-card-info {
          font-size: 11px;
          margin: 5px 0;
        }
        .member-card-print svg {
          display: block;
          width: 220px;
          height: 55px;
          margin-top: 12px;
        }
        @page {
          size: A4;
          margin: 12mm;
        }
        @media print {
          body { margin: 0; }
        }
      </style>
    </head>
    <body>
      ${content}
      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 400);
        };
      <\/script>
    </body>
    </html>
  `);

  printWindow.document.close();
}

// Cetak barcode satu buku.

function printBookBarcode(id) {
  const book = books.find(
    item => String(item.id) === String(id)
  );

  if (!book) {
    alert("Data buku tidak ditemukan.");
    return;
  }

  const barcode = createBarcodeSvg(getBookBarcode(book));

  if (!barcode) return;

  const content = `
    <div style="text-align:center; padding:30px;">
      <h2>OCEANVALLE LIBRARY</h2>
      <h3>${escapeHTML(book.title)}</h3>
      <p>${escapeHTML(book.author)}</p>
      ${barcode}
      <p>${escapeHTML(getBookBarcode(book))}</p>
    </div>
  `;

  openPrintWindow(content, "Barcode Buku - " + book.title);
}

// Cetak seluruh katalog buku.

function printCatalog() {
  if (books.length === 0) {
    alert("Belum ada buku untuk dicetak.");
    return;
  }

  const rows = books.map((book, index) => {
    const barcode = createBarcodeSvg(getBookBarcode(book));

    return `
      <tr>
        <td>${index + 1}</td>
        <td>${escapeHTML(book.title)}</td>
        <td>${escapeHTML(book.author)}</td>
        <td>${escapeHTML(book.category)}</td>
        <td>${escapeHTML(book.year || "-")}</td>
        <td>${Number(book.available)}/${Number(book.stock)}</td>
        <td>${barcode}</td>
      </tr>
    `;
  }).join("");

  const content = `
    <div class="print-header">
      <h1>OCEANVALLE LIBRARY</h1>
      <p>KATALOG KOLEKSI BUKU</p>
      <p>Tanggal cetak: ${todayString()}</p>
    </div>

    <table class="print-table">
      <thead>
        <tr>
          <th>No.</th>
          <th>Judul Buku</th>
          <th>Penulis</th>
          <th>Kategori</th>
          <th>Tahun</th>
          <th>Stok Tersedia</th>
          <th>Barcode</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;

  openPrintWindow(content, "Katalog Buku Oceanvalle");
}

// Cetak kartu anggota.

function printMemberCard(id) {
  const member = members.find(
    item => String(item.id) === String(id)
  );

  if (!member) {
    alert("Data anggota tidak ditemukan.");
    return;
  }

  const barcodeValue = getMemberBarcode(member);
  const barcode = createBarcodeSvg(barcodeValue);

  if (!barcode) return;

  const content = `
    <div class="member-card-print">
      <div class="member-card-brand">OCEANVALLE LIBRARY</div>
      <h2>MEMBER CARD</h2>
      <div class="member-card-name">
        ${escapeHTML(member.name)}
      </div>
      <p class="member-card-info">
        ID Anggota: ${escapeHTML(member.id)}
      </p>
      <p class="member-card-info">
        Email: ${escapeHTML(member.email || "-")}
      </p>
      <p class="member-card-info">
        Telepon: ${escapeHTML(member.phone || "-")}
      </p>
      ${barcode}
      <p class="member-card-info">${escapeHTML(barcodeValue)}</p>
    </div>
  `;

  openPrintWindow(content, "Kartu Anggota - " + member.name);
}

// ==========================================
// NAVIGASI HALAMAN
// ==========================================

function showPage(page) {
  document.querySelectorAll(".page").forEach(section => {
    section.classList.add("hidden");
  });

  const pageIds = {
    home: "homePage",
    collection: "collectionPage",
    login: "loginPage",
    admin: "adminPage"
  };

  const target = document.getElementById(pageIds[page]);

  if (!target) return;

  if (page === "admin" && !requireLogin()) return;

  target.classList.remove("hidden");

  if (page === "home") renderHome();
  if (page === "collection") renderCollection();
  if (page === "admin") renderDashboard();

  window.scrollTo(0, 0);
}

// ==========================================
// TAMPILAN KARTU BUKU
// ==========================================

function bookCard(book) {
  const title = escapeHTML(book.title);
  const author = escapeHTML(book.author);
  const category = escapeHTML(book.category);
  const year = escapeHTML(book.year || "-");

  let ebookButton = "";

  if (book.ebookUrl) {
    const pdfUrl = escapeHTML(getEbookUrl(book.ebookUrl));

    ebookButton = `
      <a
        href="${pdfUrl}"
        target="_blank"
        rel="noopener noreferrer"
        class="ebook-link"
      >
        Baca Ebook ↗️
      </a>
    `;
  } else {
    ebookButton = `
      <span class="hint">File ebook belum ditambahkan.</span>
    `;
  }

  return `
    <article class="book-card">
      <div class="book-cover">
        <span>${title}</span>
      </div>
      <span class="category">${category}</span>
      <h3>${title}</h3>
      <p>Penulis: ${author}</p>
      <p>Tahun: ${year}</p>
      <p>Stok tersedia: ${Number(book.available) || 0}</p>
      ${ebookButton}
    </article>
  `;
}

// ==========================================
// HALAMAN HOME
// ==========================================

function renderHome() {
  document.getElementById("homeBookCount").textContent =
    books.length;

  document.getElementById("homeMemberCount").textContent =
    members.length;

  document.getElementById("homeLoanCount").textContent =
    loans.filter(loan => loan.status === "Dipinjam").length;

  document.getElementById("featuredBooks").innerHTML =
    books.slice(0, 3).map(bookCard).join("");
}

// ==========================================
// HALAMAN COLLECTION DAN PENCARIAN
// ==========================================

function renderCollection() {
  const searchInput = document.getElementById("searchBook");
  const keyword = searchInput.value.trim().toLowerCase();

  const filteredBooks = books.filter(book => {
    return (
      String(book.title).toLowerCase().includes(keyword) ||
      String(book.author).toLowerCase().includes(keyword) ||
      String(book.category).toLowerCase().includes(keyword)
    );
  });

  document.getElementById("collectionCount").textContent =
    filteredBooks.length + " dari " + books.length + " buku";

  document.getElementById("collectionBooks").innerHTML =
    filteredBooks.length
      ? filteredBooks.map(bookCard).join("")
      : "<p>Buku tidak ditemukan.</p>";
}

// ==========================================
// LOGIN ADMIN
// ==========================================

document.getElementById("loginForm").addEventListener(
  "submit",
  function(event) {
    event.preventDefault();

    const username =
      document.getElementById("username").value.trim();

    const password =
      document.getElementById("password").value;

    const admin = admins.find(item =>
      item.username.toLowerCase() === username.toLowerCase() &&
      item.password === password
    );

    if (admin) {
      localStorage.setItem(STORAGE.session, "active");
      localStorage.setItem("oceanvalle_logged_in_user", admin.username);

      document.getElementById("loginMessage").textContent = "";
      this.reset();

      showPage("admin");
    } else {
      document.getElementById("loginMessage").textContent =
        "Username atau password salah. Silakan coba lagi.";
    }
  }
);

function requireLogin() {
  if (localStorage.getItem(STORAGE.session) !== "active") {
    showPage("login");
    return false;
  }

  return true;
}

function logout() {
  localStorage.removeItem(STORAGE.session);
  localStorage.removeItem("oceanvalle_logged_in_user");
  showPage("home");
}

// ==========================================
// DASHBOARD ADMIN
// ==========================================

function renderDashboard() {
  if (!requireLogin()) return;

  document.getElementById("statBooks").textContent =
    books.length;

  document.getElementById("statMembers").textContent =
    members.length;

  document.getElementById("statLoans").textContent =
    loans.filter(loan => loan.status === "Dipinjam").length;

  document.getElementById("statOverdue").textContent =
    loans.filter(loan =>
      loan.status === "Dipinjam" && isOverdue(loan)
    ).length;

  renderAdminBooks();
  renderAdminMembers();
  populateLoanOptions();
  renderLoans();
  renderAdminAccounts();
}

// ==========================================
// TAB ADMIN
// ==========================================

function showAdminTab(tab, button) {
  if (!requireLogin()) return;

  document.querySelectorAll(".admin-tab").forEach(section => {
    section.classList.add("hidden");
  });

  const target = document.getElementById(tab + "Tab");

  if (!target) return;

  target.classList.remove("hidden");

  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.classList.remove("active");
  });

  button.classList.add("active");

  if (tab === "circulation") {
    populateLoanOptions();
    renderLoans();
  }

  if (tab === "settings") {
    renderAdminAccounts();
  }
}

// ==========================================
// KELOLA DATA BUKU
// ==========================================

function renderAdminBooks() {
  document.getElementById("adminBooksTable").innerHTML =
    books.map(book => `
      <tr>
        <td>${escapeHTML(book.title)}</td>
        <td>${escapeHTML(book.author)}</td>
        <td>${escapeHTML(book.category)}</td>
        <td>${Number(book.available)} / ${Number(book.stock)}</td>
        <td>
          <button onclick="editBook('${escapeHTML(book.id)}')">
            Edit
          </button>
          <button onclick="printBookBarcode('${escapeHTML(book.id)}')">
            Cetak Barcode
          </button>
          <button
            class="delete"
            onclick="deleteBook('${escapeHTML(book.id)}')">
            Hapus
          </button>
        </td>
      </tr>
    `).join("");
}

// Simpan buku baru atau edit buku.

document.getElementById("bookForm").addEventListener(
  "submit",
  function(event) {
    event.preventDefault();

    if (!requireLogin()) return;

    const id = document.getElementById("bookId").value;

    const stock = Math.max(
      0,
      Number(document.getElementById("bookStock").value)
    );

    const existing = books.find(
      book => String(book.id) === String(id)
    );

    const borrowed = existing
      ? Number(existing.stock) - Number(existing.available)
      : 0;

    if (stock < borrowed) {
      alert(
        "Stok tidak boleh lebih kecil dari jumlah buku yang sedang dipinjam."
      );
      return;
    }

    const bookData = {
      id: id || makeId("book"),
      title: document.getElementById("bookTitle").value.trim(),
      author: document.getElementById("bookAuthor").value.trim(),
      category: document.getElementById("bookCategory").value.trim(),
      year: document.getElementById("bookYear").value,
      publisher: document.getElementById("bookPublisher").value.trim(),
      stock: stock,
      available: stock - borrowed,
      ebookUrl: existing ? existing.ebookUrl : ""
    };

    if (existing) {
      books = books.map(book =>
        String(book.id) === String(id) ? bookData : book
      );
    } else {
      books.push(bookData);
    }

    saveBooks();
    resetBookForm();
    renderDashboard();
    renderHome();
    renderCollection();

    alert("Data buku berhasil disimpan.");
  }
);

function editBook(id) {
  const book = books.find(
    item => String(item.id) === String(id)
  );

  if (!book) return;

  document.getElementById("bookId").value = book.id;
  document.getElementById("bookTitle").value = book.title;
  document.getElementById("bookAuthor").value = book.author;
  document.getElementById("bookCategory").value = book.category;
  document.getElementById("bookYear").value = book.year || "";
  document.getElementById("bookPublisher").value =
    book.publisher || "";
  document.getElementById("bookStock").value = book.stock;

  document.getElementById("bookTitle").focus();
}

function deleteBook(id) {
  const activeLoan = loans.some(loan =>
    String(loan.bookId) === String(id) &&
    loan.status === "Dipinjam"
  );

  if (activeLoan) {
    alert(
      "Buku masih memiliki peminjaman aktif dan tidak dapat dihapus."
    );
    return;
  }

  if (!confirm("Yakin ingin menghapus buku ini?")) return;

  books = books.filter(
    book => String(book.id) !== String(id)
  );

  saveBooks();
  renderDashboard();
  renderHome();
  renderCollection();
}

function resetBookForm() {
  document.getElementById("bookForm").reset();
  document.getElementById("bookId").value = "";
  document.getElementById("bookStock").value = 2;
}

// ==========================================
// KELOLA DATA ANGGOTA
// ==========================================

function renderAdminMembers() {
  document.getElementById("adminMembersTable").innerHTML =
    members.map(member => `
      <tr>
        <td>${escapeHTML(member.name)}</td>
        <td>${escapeHTML(member.email || "-")}</td>
        <td>${escapeHTML(member.phone || "-")}</td>
        <td>
          <button onclick="editMember('${escapeHTML(member.id)}')">
            Edit
          </button>
          <button onclick="printMemberCard('${escapeHTML(member.id)}')">
            Cetak Kartu
          </button>
          <button
            class="delete"
            onclick="deleteMember('${escapeHTML(member.id)}')">
            Hapus
          </button>
        </td>
      </tr>
    `).join("");
}

document.getElementById("memberForm").addEventListener(
  "submit",
  function(event) {
    event.preventDefault();

    if (!requireLogin()) return;

    const id = document.getElementById("memberId").value;

    const memberData = {
      id: id || makeId("member"),
      name: document.getElementById("memberName").value.trim(),
      email: document.getElementById("memberEmail").value.trim(),
      phone: document.getElementById("memberPhone").value.trim()
    };

    if (id) {
      members = members.map(member =>
        String(member.id) === String(id)
          ? memberData
          : member
      );
    } else {
      members.push(memberData);
    }

    saveMembers();
    resetMemberForm();
    renderDashboard();
    renderHome();

    alert("Data anggota berhasil disimpan.");
  }
);

function editMember(id) {
  const member = members.find(
    item => String(item.id) === String(id)
  );

  if (!member) return;

  document.getElementById("memberId").value = member.id;
  document.getElementById("memberName").value = member.name;
  document.getElementById("memberEmail").value =
    member.email || "";
  document.getElementById("memberPhone").value =
    member.phone || "";

  document.getElementById("memberName").focus();
}

function deleteMember(id) {
  const activeLoan = loans.some(loan =>
    String(loan.memberId) === String(id) &&
    loan.status === "Dipinjam"
  );

  if (activeLoan) {
    alert(
      "Anggota masih memiliki peminjaman aktif dan belum dapat dihapus."
    );
    return;
  }

  if (!confirm("Yakin ingin menghapus anggota ini?")) return;

  members = members.filter(
    member => String(member.id) !== String(id)
  );

  saveMembers();
  renderDashboard();
  renderHome();
}

function resetMemberForm() {
  document.getElementById("memberForm").reset();
  document.getElementById("memberId").value = "";
}

// ==========================================
// TAMBAHAN: KELOLA AKUN ADMIN
// ==========================================

document.getElementById("adminForm").addEventListener(
  "submit",
  function(event) {
    event.preventDefault();

    if (!requireLogin()) return;

    const username =
      document.getElementById("newAdminUsername").value.trim();

    const password =
      document.getElementById("newAdminPassword").value;

    const confirmPassword =
      document.getElementById("confirmAdminPassword").value;

    const message = document.getElementById("adminMessage");

    message.classList.remove("success");

    if (username.length < 3) {
      message.textContent = "Username minimal 3 karakter.";
      return;
    }

    if (password.length < 6) {
      message.textContent = "Password minimal 6 karakter.";
      return;
    }

    if (password !== confirmPassword) {
      message.textContent = "Konfirmasi password tidak cocok.";
      return;
    }

    const usernameExists = admins.some(admin =>
      admin.username.toLowerCase() === username.toLowerCase()
    );

    if (usernameExists) {
      message.textContent = "Username tersebut sudah digunakan.";
      return;
    }

    admins.push({
      id: makeId("admin"),
      username: username,
      password: password,
      isMain: false
    });

    saveAdmins();
    this.reset();

    message.textContent = "Admin baru berhasil ditambahkan.";
    message.classList.add("success");

    renderAdminAccounts();
  }
);

function renderAdminAccounts() {
  const tbody = document.getElementById("adminAccountsTable");

  if (!tbody) return;

  tbody.innerHTML = admins.map(admin => `
    <tr>
      <td>${escapeHTML(admin.username)}</td>
      <td>
        ${
          admin.isMain
            ? "<span class='hint'>Admin utama</span>"
            : `<button class="delete" onclick="deleteAdmin('${escapeHTML(admin.id)}')">Hapus</button>`
        }
      </td>
    </tr>
  `).join("");
}

function deleteAdmin(id) {
  const admin = admins.find(
    item => String(item.id) === String(id)
  );

  if (!admin || admin.isMain) return;

  const loggedInUser =
    localStorage.getItem("oceanvalle_logged_in_user");

  if (admin.username === loggedInUser) {
    alert("Kamu tidak dapat menghapus akun yang sedang digunakan.");
    return;
  }

  if (!confirm("Yakin ingin menghapus akun admin ini?")) return;

  admins = admins.filter(
    item => String(item.id) !== String(id)
  );

  saveAdmins();
  renderAdminAccounts();
}

// ==========================================
// SIRKULASI PEMINJAMAN
// ==========================================

function populateLoanOptions() {
  const memberSelect = document.getElementById("loanMember");
  const bookSelect = document.getElementById("loanBook");

  memberSelect.innerHTML =
    '<option value="">Pilih anggota</option>' +

    members.map(member => `
      <option value="${escapeHTML(member.id)}">
        ${escapeHTML(member.name)}
      </option>
    `).join("");

  bookSelect.innerHTML =
    '<option value="">Pilih buku</option>' +

    books
      .filter(book => Number(book.available) > 0)
      .map(book => `
        <option value="${escapeHTML(book.id)}">
          ${escapeHTML(book.title)}
          (tersedia: ${Number(book.available)})
        </option>
      `).join("");

  if (!document.getElementById("loanDate").value) {
    document.getElementById("loanDate").value = todayString();
  }
}

document.getElementById("loanForm").addEventListener(
  "submit",
  function(event) {
    event.preventDefault();

    if (!requireLogin()) return;

    const memberId =
      document.getElementById("loanMember").value;

    const bookId =
      document.getElementById("loanBook").value;

    const loanDate =
      document.getElementById("loanDate").value;

    const dueDate =
      document.getElementById("dueDate").value;

    const member = members.find(
      item => String(item.id) === String(memberId)
    );

    const book = books.find(
      item => String(item.id) === String(bookId)
    );

    if (!member || !book) {
      alert("Pilih anggota dan buku terlebih dahulu.");
      return;
    }

    if (Number(book.available) < 1) {
      alert("Stok buku tidak tersedia.");
      return;
    }

    if (!loanDate || !dueDate || dueDate < loanDate) {
      alert(
        "Tanggal jatuh tempo harus sama dengan atau setelah tanggal pinjam."
      );
      return;
    }

    book.available = Number(book.available) - 1;

    loans.push({
      id: makeId("loan"),
      memberId: member.id,
      memberName: member.name,
      bookId: book.id,
      bookTitle: book.title,
      loanDate: loanDate,
      dueDate: dueDate,
      returnDate: "",
      status: "Dipinjam",
      fine: 0
    });

    saveBooks();
    saveLoans();

    this.reset();

    document.getElementById("loanDate").value = todayString();

    renderDashboard();
    renderHome();

    alert("Peminjaman berhasil dicatat.");
  }
);

// ==========================================
// PENGEMBALIAN DAN DENDA
// ==========================================

function isOverdue(loan) {
  return loan.status === "Dipinjam" &&
    todayString() > loan.dueDate;
}

function calculateFine(loan) {
  if (loan.status === "Dikembalikan") {
    return Number(loan.fine) || 0;
  }

  const today = new Date(todayString() + "T00:00:00");
  const due = new Date(loan.dueDate + "T00:00:00");

  const lateDays = Math.max(
    0,
    Math.floor((today - due) / 86400000)
  );

  return lateDays * 2000;
}

function renderLoans() {
  const tbody = document.getElementById("adminLoansTable");

  if (loans.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="6">Belum ada data peminjaman.</td></tr>';
    return;
  }

  tbody.innerHTML = loans.map(loan => {
    const fine = calculateFine(loan);

    const status = loan.status === "Dikembalikan"
      ? "Dikembalikan"
      : isOverdue(loan)
        ? "Terlambat"
        : "Dipinjam";

    return `
      <tr>
        <td>${escapeHTML(loan.memberName)}</td>
        <td>${escapeHTML(loan.bookTitle)}</td>
        <td>${escapeHTML(loan.loanDate)}</td>
        <td>${escapeHTML(loan.dueDate)}</td>
        <td>
          ${status}<br>
          Rp${fine.toLocaleString("id-ID")}
        </td>
        <td>
          ${
            loan.status === "Dipinjam"
              ? `<button onclick="returnBook('${escapeHTML(loan.id)}')">
                   Kembalikan
                 </button>`
              : "Selesai"
          }
        </td>
      </tr>
    `;
  }).join("");
}

function returnBook(loanId) {
  const loan = loans.find(
    item => String(item.id) === String(loanId)
  );

  if (!loan || loan.status !== "Dipinjam") return;

  if (!confirm("Proses pengembalian buku ini?")) return;

  const book = books.find(
    item => String(item.id) === String(loan.bookId)
  );

  if (book) {
    book.available = Math.min(
      Number(book.stock),
      Number(book.available) + 1
    );
  }

  loan.fine = calculateFine(loan);
  loan.returnDate = todayString();
  loan.status = "Dikembalikan";

  saveBooks();
  saveLoans();

  renderDashboard();
  renderHome();

  alert(
    "Buku berhasil dikembalikan.\nDenda: Rp" +
    Number(loan.fine).toLocaleString("id-ID")
  );
}

// ==========================================
// GANTI PASSWORD ADMIN UTAMA
// ==========================================

document.getElementById("passwordForm").addEventListener(
  "submit",
  function(event) {
    event.preventDefault();

    if (!requireLogin()) return;

    const oldPassword =
      document.getElementById("oldPassword").value;

    const newPassword =
      document.getElementById("newPassword").value;

    const confirmPassword =
      document.getElementById("confirmPassword").value;

    const message =
      document.getElementById("passwordMessage");

    const savedPassword =
      localStorage.getItem(STORAGE.password) || "ocean123";

    message.classList.remove("success");

    if (oldPassword !== savedPassword) {
      message.textContent =
        "Password lama yang kamu masukkan salah.";
      return;
    }

    if (newPassword.length < 6) {
      message.textContent =
        "Password baru minimal 6 karakter.";
      return;
    }

    if (newPassword === oldPassword) {
      message.textContent =
        "Password baru harus berbeda dari password lama.";
      return;
    }

    if (newPassword !== confirmPassword) {
      message.textContent =
        "Konfirmasi password baru tidak cocok.";
      return;
    }

    localStorage.setItem(STORAGE.password, newPassword);

    const mainAdmin = admins.find(admin => admin.isMain);

    if (mainAdmin) {
      mainAdmin.password = newPassword;
      saveAdmins();
    }

    this.reset();

    message.textContent =
      "Password berhasil diganti. Gunakan password baru saat login berikutnya.";

    message.classList.add("success");
  }
);

// ==========================================
// MENJALANKAN WEBSITE
// ==========================================

document.addEventListener("DOMContentLoaded", function() {
  renderHome();

  if (localStorage.getItem(STORAGE.session) === "active") {
    showPage("admin");
  } else {
    showPage("home");
  }
});
