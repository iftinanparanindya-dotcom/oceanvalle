// ==========================================
// OCEANVALLE LIBRARY
// ==========================================

const STORAGE = {
  books: "oceanvalle_books",
  members: "oceanvalle_members",
  loans: "oceanvalle_loans",
  session: "oceanvalle_session",
  password: "oceanvalle_admin_password",
  users: "oceanvalle_users"
};

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
// PENYIMPANAN
// ==========================================

function loadData(key, fallback) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (error) {
    console.error(error);
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

function saveUsers() {
  saveData(STORAGE.users, users);
}

function makeId(prefix) {
  return prefix + "-" + Date.now() + "-" +
    Math.floor(Math.random() * 1000);
}

let books = loadData(STORAGE.books, STARTER_BOOKS);
let members = loadData(STORAGE.members, []);
let loans = loadData(STORAGE.loans, []);
let users = loadData(STORAGE.users, []);

if (!Array.isArray(books)) books = STARTER_BOOKS;
if (!Array.isArray(members)) members = [];
if (!Array.isArray(loans)) loans = [];
if (!Array.isArray(users)) users = [];

// Mempertahankan data buku lama.

books = books.map(book => {
  const starter = STARTER_BOOKS.find(item => item.id === book.id);

  if (starter) {
    return {
      ...book,
      ebookUrl: starter.ebookUrl
    };
  }

  return book;
});

saveBooks();

// Akun administrator awal.

if (!users.some(user => user.username === "admin")) {
  users.push({
    id: "user-admin",
    name: "Administrator",
    username: "admin",
    password: "ocean123",
    role: "staff"
  });

  saveUsers();
}

// ==========================================
// BANTUAN
// ==========================================

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
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

  if (/^https?:\/\//i.test(path)) return path;

  return new URL(
    path.replace(/^\/+/, ""),
    window.location.href
  ).href;
}

// ==========================================
// SESSION
// ==========================================

function getSession() {
  return loadData(STORAGE.session, null);
}

function isAdmin() {
  const session = getSession();
  return session && session.role === "staff";
}

function requireLogin() {
  if (!isAdmin()) {
    showPage("login");
    return false;
  }

  return true;
}

// ==========================================
// NAVIGASI
// ==========================================

function showPage(page) {
  document.querySelectorAll(".page").forEach(section => {
    section.classList.add("hidden");
  });

  const pageIds = {
    home: "homePage",
    collection: "collectionPage",
    login: "loginPage",
    admin: "adminPage",
    memberLogin: "memberLoginPage",
    memberDashboard: "memberDashboardPage"
  };

  const target = document.getElementById(pageIds[page]);

  if (!target) return;

  if (page === "admin" && !requireLogin()) return;

  target.classList.remove("hidden");

  if (page === "home") renderHome();
  if (page === "collection") renderCollection();
  if (page === "admin") renderDashboard();
  if (page === "memberDashboard") renderMemberBooks();

  window.scrollTo(0, 0);
}

// ==========================================
// LOGIN STAFF
// ==========================================

document.getElementById("loginForm").addEventListener(
  "submit",
  function(event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    const user = users.find(item =>
      item.username === username &&
      item.password === password &&
      item.role === "staff"
    );

    if (!user) {
      document.getElementById("loginMessage").textContent =
        "Username atau password staff salah.";

      return;
    }

    saveData(STORAGE.session, {
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role
    });

    this.reset();
    showPage("admin");
  }
);

// ==========================================
// LOGIN MEMBER
// ==========================================

document.getElementById("memberLoginForm").addEventListener(
  "submit",
  function(event) {
    event.preventDefault();

    const username =
      document.getElementById("memberUsername").value.trim();

    const password =
      document.getElementById("memberPassword").value;

    const user = users.find(item =>
      item.username === username &&
      item.password === password &&
      item.role === "member"
    );

    if (!user) {
      document.getElementById("memberLoginMessage").textContent =
        "Username atau password member salah.";

      return;
    }

    saveData(STORAGE.session, {
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role
    });

    this.reset();

    document.getElementById("memberWelcome").textContent =
      "Welcome, " + user.name + "!";

    showPage("memberDashboard");
  }
);

function memberLogout() {
  localStorage.removeItem(STORAGE.session);
  showPage("memberLogin");
}

function logout() {
  localStorage.removeItem(STORAGE.session);
  showPage("memberLogin");
}

// ==========================================
// KARTU BUKU
// ==========================================

function bookCard(book) {
  const title = escapeHTML(book.title);
  const author = escapeHTML(book.author);
  const category = escapeHTML(book.category);

  const ebookButton = book.ebookUrl
    ? `<a href="${escapeHTML(getEbookUrl(book.ebookUrl))}"
         target="_blank" rel="noopener noreferrer">
         Baca Ebook ↗️
       </a>`
    : `<span class="hint">File ebook belum ditambahkan.</span>`;

  return `
    <article class="book-card">
      <div class="book-cover">
        <span>${title}</span>
      </div>

      <span class="category">${category}</span>
      <h3>${title}</h3>
      <p>Penulis: ${author}</p>
      <p>Tahun: ${escapeHTML(book.year || "-")}</p>
      <p>Stok tersedia: ${Number(book.available) || 0}</p>
      ${ebookButton}
    </article>
  `;
}

// ==========================================
// HOME
// ==========================================

function renderHome() {
  document.getElementById("homeBookCount").textContent = books.length;
  document.getElementById("homeMemberCount").textContent = members.length;

  document.getElementById("homeLoanCount").textContent =
    loans.filter(loan => loan.status === "Dipinjam").length;

  document.getElementById("featuredBooks").innerHTML =
    books.slice(0, 3).map(bookCard).join("");
}

// ==========================================
// KOLEKSI
// ==========================================

function renderCollection() {
  const keyword = document.getElementById("searchBook")
    .value.trim().toLowerCase();

  const filtered = books.filter(book =>
    String(book.title).toLowerCase().includes(keyword) ||
    String(book.author).toLowerCase().includes(keyword) ||
    String(book.category).toLowerCase().includes(keyword)
  );

  document.getElementById("collectionCount").textContent =
    filtered.length + " dari " + books.length + " buku";

  document.getElementById("collectionBooks").innerHTML =
    filtered.length
      ? filtered.map(bookCard).join("")
      : "<p>Buku tidak ditemukan.</p>";
}

// ==========================================
// KOLEKSI MEMBER
// ==========================================

function renderMemberBooks() {
  const input = document.getElementById("memberSearch");
  if (!input) return;

  const keyword = input.value.toLowerCase().trim();

  const filtered = books.filter(book =>
    String(book.title).toLowerCase().includes(keyword) ||
    String(book.author).toLowerCase().includes(keyword) ||
    String(book.category).toLowerCase().includes(keyword)
  );

  document.getElementById("memberBooks").innerHTML =
    filtered.length
      ? filtered.map(bookCard).join("")
      : "<p>Buku tidak ditemukan.</p>";
}

// ==========================================
// DASHBOARD
// ==========================================

function renderDashboard() {
  if (!requireLogin()) return;

  document.getElementById("statBooks").textContent = books.length;
  document.getElementById("statMembers").textContent = members.length;

  document.getElementById("statLoans").textContent =
    loans.filter(loan => loan.status === "Dipinjam").length;

  document.getElementById("statOverdue").textContent =
    loans.filter(loan =>
      loan.status === "Dipinjam" && isOverdue(loan)
    ).length;

  renderAdminBooks();
  renderAdminMembers();
  renderAdminUsers();
  populateLoanOptions();
  renderLoans();
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

  if (tab === "users") renderAdminUsers();
}

// ==========================================
// DATA BUKU
// ==========================================

function renderAdminBooks() {
  document.getElementById("adminBooksTable").innerHTML =
    books.map(book => `
      <tr>
        <td>${escapeHTML(book.title)}</td>
        <td>${escapeHTML(book.author)}</td>
        <td>${escapeHTML(book.category)}</td>
        <td>${book.available} / ${book.stock}</td>
        <td>
          <button onclick="editBook('${book.id}')">Edit</button>
          <button onclick="printBookBarcode('${book.id}')">Barcode</button>
          <button class="delete" onclick="deleteBook('${book.id}')">Hapus</button>
        </td>
      </tr>
    `).join("");
}

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

    const existing = books.find(book => book.id === id);

    const borrowed = existing
      ? Number(existing.stock) - Number(existing.available)
      : 0;

    if (stock < borrowed) {
      alert("Stok tidak boleh lebih kecil dari jumlah buku yang dipinjam.");
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
        book.id === id ? bookData : book
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
  const book = books.find(item => item.id === id);
  if (!book) return;

  document.getElementById("bookId").value = book.id;
  document.getElementById("bookTitle").value = book.title;
  document.getElementById("bookAuthor").value = book.author;
  document.getElementById("bookCategory").value = book.category;
  document.getElementById("bookYear").value = book.year || "";
  document.getElementById("bookPublisher").value = book.publisher || "";
  document.getElementById("bookStock").value = book.stock;

  document.getElementById("bookTitle").focus();
}

function deleteBook(id) {
  const activeLoan = loans.some(loan =>
    loan.bookId === id && loan.status === "Dipinjam"
  );

  if (activeLoan) {
    alert("Buku masih memiliki peminjaman aktif.");
    return;
  }

  if (!confirm("Yakin ingin menghapus buku ini?")) return;

  books = books.filter(book => book.id !== id);

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
// DATA ANGGOTA
// ==========================================

function renderAdminMembers() {
  document.getElementById("adminMembersTable").innerHTML =
    members.map(member => `
      <tr>
        <td>${escapeHTML(member.name)}</td>
        <td>${escapeHTML(member.email || "-")}</td>
        <td>${escapeHTML(member.phone || "-")}</td>
        <td>
          <button onclick="editMember('${member.id}')">Edit</button>
          <button class="print-card-btn"
            onclick="printMemberCard('${member.id}')">
            Cetak Kartu
          </button>
          <button class="delete"
            onclick="deleteMember('${member.id}')">
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

    const data = {
      id: id || makeId("member"),
      name: document.getElementById("memberName").value.trim(),
      email: document.getElementById("memberEmail").value.trim(),
      phone: document.getElementById("memberPhone").value.trim()
    };

    if (id) {
      members = members.map(member =>
        member.id === id ? data : member
      );
    } else {
      members.push(data);
    }

    saveMembers();
    resetMemberForm();
    renderDashboard();
    renderHome();

    alert("Data anggota berhasil disimpan.");
  }
);

function editMember(id) {
  const member = members.find(item => item.id === id);
  if (!member) return;

  document.getElementById("memberId").value = member.id;
  document.getElementById("memberName").value = member.name;
  document.getElementById("memberEmail").value = member.email || "";
  document.getElementById("memberPhone").value = member.phone || "";
}

function deleteMember(id) {
  const activeLoan = loans.some(loan =>
    loan.memberId === id && loan.status === "Dipinjam"
  );

  if (activeLoan) {
    alert("Anggota masih memiliki peminjaman aktif.");
    return;
  }

  if (!confirm("Yakin ingin menghapus anggota ini?")) return;

  members = members.filter(member => member.id !== id);

  saveMembers();
  renderDashboard();
  renderHome();
}

function resetMemberForm() {
  document.getElementById("memberForm").reset();
  document.getElementById("memberId").value = "";
}

// ==========================================
// TAMBAH AKUN MEMBER DAN STAFF
// ==========================================

document.getElementById("userForm").addEventListener(
  "submit",
  function(event) {
    event.preventDefault();

    if (!requireLogin()) return;

    const name = document.getElementById("newUserName").value.trim();
    const username = document.getElementById("newUsername").value.trim();
    const password = document.getElementById("newUserPassword").value;
    const role = document.getElementById("newUserRole").value;

    if (users.some(user => user.username.toLowerCase() === username.toLowerCase())) {
      alert("Username sudah digunakan.");
      return;
    }

    if (password.length < 6) {
      alert("Password minimal 6 karakter.");
      return;
    }

    const user = {
      id: makeId("user"),
      name,
      username,
      password,
      role
    };

    users.push(user);
    saveUsers();

    // Jika membuat akun member, otomatis buat data anggota.
    if (role === "member") {
      members.push({
        id: user.id,
        name: name,
        email: "",
        phone: "",
        userId: user.id
      });

      saveMembers();
    }

    this.reset();

    renderDashboard();
    renderHome();

    alert("Akun " + role + " berhasil dibuat.");
  }
);

function renderAdminUsers() {
  const tbody = document.getElementById("adminUsersTable");

  tbody.innerHTML = users.map(user => `
    <tr>
      <td>${escapeHTML(user.name)}</td>
      <td>${escapeHTML(user.username)}</td>
      <td>${user.role === "staff" ? "Staff" : "Member"}</td>
      <td>
        ${
          user.username !== "admin"
            ? `<button class="delete"
                 onclick="deleteUser('${user.id}')">
                 Hapus
               </button>`
            : "Administrator utama"
        }
      </td>
    </tr>
  `).join("");
}

function deleteUser(id) {
  const user = users.find(item => item.id === id);

  if (!user) return;

  if (user.username === "admin") {
    alert("Administrator utama tidak dapat dihapus.");
    return;
  }

  if (!confirm("Hapus akun ini?")) return;

  users = users.filter(item => item.id !== id);

  if (user.role === "member") {
    const activeLoan = loans.some(loan =>
      loan.memberId === user.id && loan.status === "Dipinjam"
    );

    if (activeLoan) {
      alert("Akun memiliki peminjaman aktif dan tidak dapat dihapus.");
      users.push(user);
      return;
    }

    members = members.filter(member => member.id !== user.id);
    saveMembers();
  }

  saveUsers();
  renderDashboard();
  renderHome();
}

// ==========================================
// CETAK KATALOG BUKU
// ==========================================

function printCatalog() {
  if (!requireLogin()) return;

  const rows = books.map(book => `
    <tr>
      <td>${escapeHTML(book.title)}</td>
      <td>${escapeHTML(book.author)}</td>
      <td>${escapeHTML(book.category)}</td>
      <td>${escapeHTML(book.year || "-")}</td>
      <td>${escapeHTML(book.publisher || "-")}</td>
      <td>${book.available}/${book.stock}</td>
    </tr>
  `).join("");

  const win = window.open("", "_blank");

  if (!win) {
    alert("Izinkan pop-up browser untuk mencetak katalog.");
    return;
  }

  win.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Katalog Oceanvalle Library</title>
      <style>
        body {
          font-family: Arial;
          padding: 30px;
          color: #503923;
        }
        h1 { text-align:center; }
        p { text-align:center; }
        table {
          width:100%;
          border-collapse:collapse;
          margin-top:30px;
        }
        th,td {
          border:1px solid #999;
          padding:10px;
          text-align:left;
          font-size:12px;
        }
        th { background:#C0DDDA; }
      </style>
    </head>
    <body>
      <h1>OCEANVALLE LIBRARY</h1>
      <p>KATALOG BUKU</p>
      <p>Tanggal cetak: ${todayString()}</p>
      <table>
        <thead>
          <tr>
            <th>Judul</th>
            <th>Penulis</th>
            <th>Kategori</th>
            <th>Tahun</th>
            <th>Penerbit</th>
            <th>Stok</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <script>
        window.onload = function() {
          window.print();
        };
      <\/script>
    </body>
    </html>
  `);

  win.document.close();
}

// ==========================================
// CETAK BARCODE BUKU
// ==========================================

// Menggunakan JsBarcode dari CDN.

function loadBarcodeLibrary() {
  return new Promise((resolve, reject) => {
    if (window.JsBarcode) {
      resolve();
      return;
    }

    const script = document.createElement("script");

    script.src = "https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js";

    script.onload = resolve;
    script.onerror = () => reject(new Error("Gagal memuat barcode."));

    document.head.appendChild(script);
  });
}

async function printBookBarcode(id) {
  if (!requireLogin()) return;

  const book = books.find(item => item.id === id);
  if (!book) return;

  try {
    await loadBarcodeLibrary();

    const win = window.open("", "_blank");

    if (!win) {
      alert("Izinkan pop-up browser untuk mencetak barcode.");
      return;
    }

    const barcodeValue = String(book.id).replace(/[^a-zA-Z0-9]/g, "");

    const svg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );

    JsBarcode(svg, barcodeValue, {
      format: "CODE128",
      width: 2,
      height: 65,
      displayValue: true
    });

    const barcodeHTML = new XMLSerializer().serializeToString(svg);

    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Barcode Buku</title>
        <style>
          body {
            font-family:Arial;
            text-align:center;
            padding:30px;
          }
          .label {
            border:1px solid #333;
            display:inline-block;
            padding:20px;
            width:300px;
          }
        </style>
      </head>
      <body>
        <div class="label">
          <h3>OCEANVALLE LIBRARY</h3>
          <p>${escapeHTML(book.title)}</p>
          ${barcodeHTML}
          <p>${escapeHTML(book.id)}</p>
        </div>
        <script>
          window.onload = function() {
            window.print();
          };
        <\/script>
      </body>
      </html>
    `);

    win.document.close();

  } catch (error) {
    alert("Barcode gagal dibuat. Periksa koneksi internet.");
    console.error(error);
  }
}

// ==========================================
// CETAK KARTU ANGGOTA
// ==========================================

function printMemberCard(id) {
  if (!requireLogin()) return;

  const member = members.find(item => item.id === id);

  if (!member) return;

  const win = window.open("", "_blank");

  if (!win) {
    alert("Izinkan pop-up browser untuk mencetak kartu.");
    return;
  }

  win.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Kartu Anggota Oceanvalle</title>
      <style>
        body {
          font-family:Arial;
          padding:30px;
        }
        .card {
          width:340px;
          min-height:200px;
          padding:22px;
          background:#C0DDDA;
          border:2px solid #775537;
          border-radius:12px;
          color:#503923;
        }
        .logo {
          font-size:15px;
          letter-spacing:3px;
          font-weight:bold;
        }
        .name {
          font-size:20px;
          font-weight:bold;
          margin-top:30px;
        }
        .number {
          font-size:12px;
          margin-top:10px;
        }
        .footer {
          font-size:10px;
          letter-spacing:2px;
          margin-top:25px;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="logo">OCEANVALLE LIBRARY</div>
        <div>MEMBER CARD</div>
        <div class="name">${escapeHTML(member.name)}</div>
        <div class="number">
          ID: ${escapeHTML(member.id)}
        </div>
        <div class="footer">READ · LEARN · GROW</div>
      </div>

      <script>
        window.onload = function() {
          window.print();
        };
      <\/script>
    </body>
    </html>
  `);

  win.document.close();
}

// ==========================================
// SIRKULASI
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
    books.filter(book => Number(book.available) > 0)
      .map(book => `
        <option value="${escapeHTML(book.id)}">
          ${escapeHTML(book.title)}
          (tersedia: ${book.available})
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

    const memberId = document.getElementById("loanMember").value;
    const bookId = document.getElementById("loanBook").value;
    const loanDate = document.getElementById("loanDate").value;
    const dueDate = document.getElementById("dueDate").value;

    const member = members.find(item => item.id === memberId);
    const book = books.find(item => item.id === bookId);

    if (!member || !book) {
      alert("Pilih anggota dan buku terlebih dahulu.");
      return;
    }

    if (Number(book.available) < 1) {
      alert("Stok buku tidak tersedia.");
      return;
    }

    if (!loanDate || !dueDate || dueDate < loanDate) {
      alert("Tanggal jatuh tempo tidak valid.");
      return;
    }

    book.available--;

    loans.push({
      id: makeId("loan"),
      memberId: member.id,
      memberName: member.name,
      bookId: book.id,
      bookTitle: book.title,
      loanDate,
      dueDate,
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
// DENDA DAN PENGEMBALIAN
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
              ? `<button onclick="returnBook('${loan.id}')">
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
  const loan = loans.find(item => item.id === loanId);

  if (!loan || loan.status !== "Dipinjam") return;

  if (!confirm("Proses pengembalian buku ini?")) return;

  const book = books.find(item => item.id === loan.bookId);

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
// GANTI PASSWORD ADMIN
// ==========================================

document.getElementById("passwordForm").addEventListener(
  "submit",
  function(event) {
    event.preventDefault();

    if (!requireLogin()) return;

    const oldPassword = document.getElementById("oldPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    const message = document.getElementById("passwordMessage");

    const session = getSession();

    const user = users.find(item => item.id === session.id);

    message.classList.remove("success");

    if (!user || user.password !== oldPassword) {
      message.textContent = "Password lama salah.";
      return;
    }

    if (newPassword.length < 6) {
      message.textContent = "Password minimal 6 karakter.";
      return;
    }

    if (newPassword === oldPassword) {
      message.textContent = "Password baru harus berbeda.";
      return;
    }

    if (newPassword !== confirmPassword) {
      message.textContent = "Konfirmasi password tidak cocok.";
      return;
    }

    user.password = newPassword;

    saveUsers();

    // Tetap sinkron dengan penyimpanan password lama.
    if (user.username === "admin") {
      localStorage.setItem(STORAGE.password, newPassword);
    }

    this.reset();

    message.textContent = "Password berhasil diganti.";
    message.classList.add("success");
  }
);

// ==========================================
// MENJALANKAN WEBSITE
// ==========================================

document.addEventListener("DOMContentLoaded", function() {

  renderHome();

  const session = getSession();

  if (session && session.role === "staff") {
    showPage("admin");
  } else if (session && session.role === "member") {
    document.getElementById("memberWelcome").textContent =
      "Welcome, " + session.name + "!";

    showPage("memberDashboard");
  } else {
    showPage("memberLogin");
  }

});
