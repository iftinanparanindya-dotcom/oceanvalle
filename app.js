
// ==========================================
// OCEANVALLE DIGITAL LIBRARY
// ==========================================

const STORAGE = {
  books: "oceanvalle_books",
  members: "oceanvalle_members",
  loans: "oceanvalle_loans",
  session: "oceanvalle_session",
  memberSession: "oceanvalle_member_session",
  password: "oceanvalle_admin_password"
};

// ==========================================
// DATA AWAL 10 EBOOK
// ==========================================

const STARTER_BOOKS = [
  {
    id: "book-1", code: "OV0001",
    title: "A Game of Ghosts", author: "John Connolly",
    category: "Fiction", year: 2017,
    publisher: "Hodder & Stoughton", stock: 2, available: 2,
    ebookUrl: "assets/ebooks/a-game-of-ghost.pdf"
  },
  {
    id: "book-2", code: "OV0002",
    title: "Steelheart", author: "Brandon Sanderson",
    category: "Fantasy", year: 2013,
    publisher: "Delacorte Press", stock: 2, available: 2,
    ebookUrl: "assets/ebooks/steelheart.pdf"
  },
  {
    id: "book-3", code: "OV0003",
    title: "Calamity", author: "Brandon Sanderson",
    category: "Fantasy", year: 2016,
    publisher: "Delacorte Press", stock: 2, available: 2,
    ebookUrl: "assets/ebooks/calamity.pdf"
  },
  {
    id: "book-4", code: "OV0004",
    title: "MADILOG", author: "Tan Malaka",
    category: "Nonfiksi", year: 1943,
    publisher: "", stock: 2, available: 2,
    ebookUrl: "assets/ebooks/madilog.pdf"
  },
  {
    id: "book-5", code: "OV0005",
    title: "Gadis Kretek", author: "Ratih Kumala",
    category: "Fiction", year: 2012,
    publisher: "Gramedia Pustaka Utama", stock: 2, available: 2,
    ebookUrl: "assets/ebooks/gadis-kretek.pdf"
  },
  {
    id: "book-6", code: "OV0006",
    title: "Sang Alkemis", author: "Paulo Coelho",
    category: "Fiction", year: 1988,
    publisher: "", stock: 2, available: 2,
    ebookUrl: "assets/ebooks/sang-alkemis.pdf"
  },
  {
    id: "book-7", code: "OV0007",
    title: "Serbuk Bintang (Stardust)", author: "Neil Gaiman",
    category: "Fantasy", year: 1999,
    publisher: "", stock: 2, available: 2,
    ebookUrl: "assets/ebooks/serbuk-bintang.pdf"
  },
  {
    id: "book-8", code: "OV0008",
    title: "Legend", author: "Marie Lu",
    category: "Dystopian", year: 2011,
    publisher: "", stock: 2, available: 2,
    ebookUrl: "assets/ebooks/legend.pdf"
  },
  {
    id: "book-9", code: "OV0009",
    title: "Pergi", author: "Tere Liye",
    category: "Fiction", year: 2018,
    publisher: "", stock: 2, available: 2,
    ebookUrl: "assets/ebooks/pergi.pdf"
  },
  {
    id: "book-10", code: "OV0010",
    title: "Pulang", author: "Tere Liye",
    category: "Fiction", year: 2015,
    publisher: "", stock: 2, available: 2,
    ebookUrl: "assets/ebooks/pulang.pdf"
  }
];

// ==========================================
// PENYIMPANAN DATA
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

function makeId(prefix) {
  return prefix + "-" + Date.now() + "-" +
    Math.floor(Math.random() * 10000);
}

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
// INISIALISASI DATA
// ==========================================

let books = loadData(STORAGE.books, STARTER_BOOKS);
let members = loadData(STORAGE.members, []);
let loans = loadData(STORAGE.loans, []);

if (!Array.isArray(books)) books = STARTER_BOOKS;
if (!Array.isArray(members)) members = [];
if (!Array.isArray(loans)) loans = [];

books = books.map((book, index) => {
  const starter = STARTER_BOOKS.find(item => item.id === book.id);

  return {
    ...book,
    code: book.code || starter?.code || generateBookCode(index + 11),
    stock: Number(book.stock) || 0,
    available: book.available === undefined
      ? Number(book.stock) || 0
      : Number(book.available),
    ebookUrl: starter?.ebookUrl || book.ebookUrl || ""
  };
});

members = members.map((member, index) => ({
  ...member,
  memberNo: member.memberNo || generateMemberNumber(index + 1)
}));

saveBooks();
saveMembers();

// ==========================================
// GENERATOR KODE BUKU DAN ANGGOTA
// ==========================================

function generateBookCode(number) {
  let code;
  let counter = number;

  do {
    code = "OV" + String(counter).padStart(4, "0");
    counter++;
  } while (books.some(book => book.code === code));

  return code;
}

function generateMemberNumber(number) {
  let code;
  let counter = number;

  do {
    code = "OVM" + String(counter).padStart(4, "0");
    counter++;
  } while (members.some(member => member.memberNo === code));

  return code;
}

// ==========================================
// GENERATOR BARCODE
// ==========================================

function barcodeSVG(value, width = 1.5) {
  if (!window.JsBarcode) {
    return "<span>Barcode tidak dapat dimuat.</span>";
  }

  const svg = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );

  JsBarcode(svg, String(value), {
    format: "CODE128",
    width: width,
    height: 48,
    displayValue: true,
    fontSize: 12,
    margin: 5,
    background: "#ffffff",
    lineColor: "#000000"
  });

  return svg.outerHTML;
}

// ==========================================
// SISTEM LOGIN MEMBER
// ==========================================

function getLoggedInMember() {
  const memberId = localStorage.getItem(STORAGE.memberSession);
  if (!memberId) return null;

  return members.find(member => member.id === memberId) || null;
}

function toggleMemberAuth(section) {
  document.getElementById("memberLoginBox").classList.toggle(
    "hidden", section !== "login"
  );

  document.getElementById("memberRegisterBox").classList.toggle(
    "hidden", section !== "register"
  );

  document.getElementById("memberActivateBox").classList.toggle(
    "hidden", section !== "activate"
  );

  ["memberLoginMessage", "memberRegisterMessage", "memberActivateMessage"]
    .forEach(id => {
      const element = document.getElementById(id);
      if (element) element.textContent = "";
    });
}

document.getElementById("memberLoginForm").addEventListener(
  "submit",
  function(event) {
    event.preventDefault();

    const email = document.getElementById("memberLoginEmail")
      .value.trim().toLowerCase();

    const password = document.getElementById("memberLoginPassword").value;
    const message = document.getElementById("memberLoginMessage");

    const member = members.find(item =>
      String(item.email || "").trim().toLowerCase() === email
    );

    if (!member) {
      message.textContent = "Akun tidak ditemukan. Periksa kembali email kamu.";
      return;
    }

    if (!member.password) {
      message.textContent =
        "Akun belum diaktifkan. Gunakan fitur Aktivasi Akun terlebih dahulu.";
      return;
    }

    if (member.password !== password) {
      message.textContent = "Password yang kamu masukkan salah.";
      return;
    }

    localStorage.removeItem(STORAGE.session);
    localStorage.setItem(STORAGE.memberSession, member.id);

    this.reset();
    showPage("home");
  }
);

// ==========================================
// REGISTRASI MEMBER
// ==========================================

document.getElementById("memberRegisterForm").addEventListener(
  "submit",
  function(event) {
    event.preventDefault();

    const name = document.getElementById("registerMemberName")
      .value.trim();

    const email = document.getElementById("registerMemberEmail")
      .value.trim().toLowerCase();

    const phone = document.getElementById("registerMemberPhone")
      .value.trim();

    const password = document.getElementById("registerMemberPassword").value;
    const confirmPassword =
      document.getElementById("registerMemberConfirm").value;

    const message = document.getElementById("memberRegisterMessage");

    const emailExists = members.some(member =>
      String(member.email || "").trim().toLowerCase() === email
    );

    if (emailExists) {
      message.textContent = "Email sudah terdaftar. Silakan login atau aktivasi akun.";
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

    const member = {
      id: makeId("member"),
      memberNo: generateMemberNumber(members.length + 1),
      name,
      email,
      phone,
      password
    };

    members.push(member);
    saveMembers();

    localStorage.removeItem(STORAGE.session);
    localStorage.setItem(STORAGE.memberSession, member.id);

    this.reset();

    alert(
      "Registrasi berhasil!\nNomor anggota kamu: " +
      member.memberNo
    );

    showPage("home");
  }
);

// ==========================================
// AKTIVASI MEMBER YANG DIBUAT ADMIN
// ==========================================

document.getElementById("memberActivateForm").addEventListener(
  "submit",
  function(event) {
    event.preventDefault();

    const memberNo = document.getElementById("activateMemberNo")
      .value.trim().toUpperCase();

    const email = document.getElementById("activateMemberEmail")
      .value.trim().toLowerCase();

    const password = document.getElementById("activateMemberPassword").value;
    const confirmPassword =
      document.getElementById("activateMemberConfirm").value;

    const message = document.getElementById("memberActivateMessage");

    const member = members.find(item =>
      String(item.memberNo || "").toUpperCase() === memberNo &&
      String(item.email || "").trim().toLowerCase() === email
    );

    if (!member) {
      message.textContent =
        "Data anggota tidak ditemukan. Periksa nomor anggota dan email.";
      return;
    }

    if (member.password) {
      message.textContent =
        "Akun ini sudah aktif. Silakan login menggunakan email dan password.";
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

    member.password = password;
    saveMembers();

    localStorage.removeItem(STORAGE.session);
    localStorage.setItem(STORAGE.memberSession, member.id);

    this.reset();

    alert("Akun berhasil diaktifkan. Selamat datang di Oceanvalle!");

    showPage("home");
  }
);

// ==========================================
// LOGOUT MEMBER
// ==========================================

function logoutMember() {
  localStorage.removeItem(STORAGE.memberSession);
  showPage("memberLogin");
}

// ==========================================
// NAVIGASI HALAMAN
// ==========================================

function showPage(page) {
  const member = getLoggedInMember();
  const isAdmin = localStorage.getItem(STORAGE.session) === "active";

  // Halaman umum yang membutuhkan login member.
  if (
    (page === "home" || page === "collection") &&
    !member
  ) {
    page = "memberLogin";
  }

  // Member tidak dapat membuka dashboard admin.
  if (page === "admin" && !isAdmin) {
    page = "login";
  }

  // Member yang sudah login tidak perlu melihat halaman login lagi
  // selama sesi website yang sedang berjalan.
  if (page === "memberLogin" && member) {
    page = "home";
  }

  document.querySelectorAll(".page").forEach(section => {
    section.classList.add("hidden");
  });

  const pageIds = {
    memberLogin: "memberLoginPage",
    home: "homePage",
    collection: "collectionPage",
    login: "loginPage",
    admin: "adminPage"
  };

  const target = document.getElementById(pageIds[page]);
  if (!target) return;

  target.classList.remove("hidden");

  const logoutButton = document.getElementById("memberLogoutNav");
  if (logoutButton) {
    logoutButton.classList.toggle("hidden", !member);
  }

  const memberLoginButton = document.getElementById("memberLoginNav");
  if (memberLoginButton) {
    memberLoginButton.classList.toggle("hidden", Boolean(member));
  }

  if (page === "home") renderHome();
  if (page === "collection") renderCollection();
  if (page === "admin") renderDashboard();

  if (page === "memberLogin") {
    toggleMemberAuth("login");
  }

  window.scrollTo(0, 0);
}

// ==========================================
// KARTU BUKU
// ==========================================

function bookCard(book) {
  const title = escapeHTML(book.title);
  const author = escapeHTML(book.author);
  const category = escapeHTML(book.category);
  const year = escapeHTML(book.year || "-");

  const ebookButton = book.ebookUrl
    ? `<a href="${escapeHTML(getEbookUrl(book.ebookUrl))}"
         target="_blank" rel="noopener noreferrer">
         Baca Ebook ↗
       </a>`
    : `<span class="hint">File ebook belum ditambahkan.</span>`;

  return `
    <article class="book-card">
      <div class="book-cover"><span>${title}</span></div>
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
// COLLECTION
// ==========================================

function renderCollection() {
  const keyword = document.getElementById("searchBook")
    .value.trim().toLowerCase();

  const filtered = books.filter(book =>
    [book.title, book.author, book.category, book.code]
      .some(value => String(value || "").toLowerCase().includes(keyword))
  );

  document.getElementById("collectionCount").textContent =
    filtered.length + " dari " + books.length + " buku";

  document.getElementById("collectionBooks").innerHTML =
    filtered.length
      ? filtered.map(bookCard).join("")
      : "<p>Buku tidak ditemukan.</p>";
}

// ==========================================
// LOGIN ADMIN
// ==========================================

document.getElementById("loginForm").addEventListener(
  "submit",
  function(event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    const savedPassword =
      localStorage.getItem(STORAGE.password) || "ocean123";

    if (username === "admin" && password === savedPassword) {
      localStorage.removeItem(STORAGE.memberSession);
      localStorage.setItem(STORAGE.session, "active");

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
  showPage("memberLogin");
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
  renderAdminCatalog();
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

  if (tab === "catalog") {
    renderAdminCatalog();
  }
}

// ==========================================
// DATA BUKU
// ==========================================

function renderAdminBooks() {
  const tbody = document.getElementById("adminBooksTable");

  tbody.innerHTML = books.map(book => `
    <tr>
      <td>${escapeHTML(book.code)}</td>
      <td>${escapeHTML(book.title)}</td>
      <td>${escapeHTML(book.author)}</td>
      <td>${escapeHTML(book.category)}</td>
      <td>${Number(book.available)} / ${Number(book.stock)}</td>
      <td class="barcode-cell">${barcodeSVG(book.code, 1)}</td>
      <td>
        <button onclick="printBookBarcode('${book.id}')">Cetak</button>
        <button onclick="editBook('${book.id}')">Edit</button>
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
    const existing = books.find(book => book.id === id);

    const stock = Math.max(0, Number(
      document.getElementById("bookStock").value
    ));

    const borrowed = existing
      ? Number(existing.stock) - Number(existing.available)
      : 0;

    if (stock < borrowed) {
      alert("Stok tidak boleh lebih kecil dari jumlah buku yang sedang dipinjam.");
      return;
    }

    const bookData = {
      id: id || makeId("book"),
      code: existing ? existing.code : generateBookCode(books.length + 1),
      title: document.getElementById("bookTitle").value.trim(),
      author: document.getElementById("bookAuthor").value.trim(),
      category: document.getElementById("bookCategory").value.trim(),
      year: document.getElementById("bookYear").value,
      publisher: document.getElementById("bookPublisher").value.trim(),
      stock,
      available: stock - borrowed,
      ebookUrl: document.getElementById("bookEbook").value.trim()
    };

    if (existing) {
      books = books.map(book => book.id === id ? bookData : book);
    } else {
      books.push(bookData);
    }

    saveBooks();
    resetBookForm();
    renderDashboard();
    renderHome();
    renderCollection();

    alert("Data buku berhasil disimpan. Kode dan barcode buku sudah dibuat.");
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
  document.getElementById("bookEbook").value = book.ebookUrl || "";

  document.getElementById("bookTitle").focus();
  window.scrollTo(0, 0);
}

function deleteBook(id) {
  const activeLoan = loans.some(loan =>
    loan.bookId === id && loan.status === "Dipinjam"
  );

  if (activeLoan) {
    alert("Buku masih memiliki peminjaman aktif dan tidak dapat dihapus.");
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
// CETAK BARCODE BUKU
// ==========================================

function openPrintWindow(title, content) {
  const printWindow = window.open("", "_blank");

  if (!printWindow) {
    alert("Popup diblokir browser. Izinkan pop-up untuk mencetak.");
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
          font-family: Arial, sans-serif;
          color: #302D29;
          padding: 25px;
        }
        h1 { color: #503923; }
        table { width: 100%; border-collapse: collapse; }
        th, td {
          border: 1px solid #ddd;
          padding: 9px;
          text-align: left;
          font-size: 11px;
        }
        th { background: #f3f0e9; }
        .barcode-label {
          display: inline-block;
          border: 1px solid #ddd;
          padding: 12px;
          margin: 8px;
          text-align: center;
          background: white;
          break-inside: avoid;
        }
        .barcode-label svg { max-width: 100%; height: auto; }
        .member-card {
          width: 340px;
          min-height: 210px;
          border: 2px solid #775537;
          border-radius: 12px;
          padding: 18px;
          margin: 15px auto;
          text-align: center;
        }
        .member-card h2 { color: #775537; margin: 5px; }
        .member-card .member-name { font-size: 18px; font-weight: bold; }
        .member-card svg { max-width: 100%; }
        .member-card p { font-size: 11px; }
        .print-button {
          background: #775537;
          color: white;
          padding: 10px 20px;
          border: 0;
          border-radius: 4px;
          cursor: pointer;
          margin-bottom: 20px;
        }
        @media print {
          body { padding: 0; }
          .print-button { display: none; }
        }
      </style>
    </head>
    <body>
      <button class="print-button" onclick="window.print()">Cetak</button>
      ${content}
    </body>
    </html>
  `);
  printWindow.document.close();
}

function printBookBarcode(id) {
  const book = books.find(item => item.id === id);
  if (!book) return;

  const barcode = barcodeSVG(book.code, 2);

  openPrintWindow("Barcode Buku " + book.title, `
    <div class="barcode-label">
      <strong>OCEANVALLE LIBRARY</strong>
      <p>${escapeHTML(book.title)}</p>
      ${barcode}
      <small>${escapeHTML(book.code)}</small>
    </div>
  `);
}

// ==========================================
// DATA ANGGOTA
// ==========================================

function renderAdminMembers() {
  document.getElementById("adminMembersTable").innerHTML =
    members.map(member => `
      <tr>
        <td>${escapeHTML(member.memberNo)}</td>
        <td>${escapeHTML(member.name)}</td>
        <td>${escapeHTML(member.email || "-")}</td>
        <td>${escapeHTML(member.phone || "-")}</td>
        <td>
          <button onclick="printMemberCard('${member.id}')">Cetak Kartu</button>
        </td>
        <td>
          <button onclick="editMember('${member.id}')">Edit</button>
          <button class="delete" onclick="deleteMember('${member.id}')">Hapus</button>
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
    const existing = members.find(member => member.id === id);

    const email = document.getElementById("memberEmail")
      .value.trim().toLowerCase();

    const duplicateEmail = members.some(member =>
      member.id !== id &&
      String(member.email || "").trim().toLowerCase() === email &&
      email !== ""
    );

    if (duplicateEmail) {
      alert("Email tersebut sudah digunakan oleh anggota lain.");
      return;
    }

    const memberData = {
      ...(existing || {}),
      id: id || makeId("member"),
      memberNo: existing
        ? existing.memberNo
        : generateMemberNumber(members.length + 1),
      name: document.getElementById("memberName").value.trim(),
      email,
      phone: document.getElementById("memberPhone").value.trim()
    };

    if (existing) {
      members = members.map(member =>
        member.id === id ? memberData : member
      );
    } else {
      members.push(memberData);
    }

    saveMembers();
    resetMemberForm();
    renderDashboard();
    renderHome();

    alert(
      existing
        ? "Data anggota berhasil diperbarui."
        : "Data anggota berhasil disimpan. Anggota dapat mengaktifkan akun melalui halaman Member Login."
    );
  }
);

function editMember(id) {
  const member = members.find(item => item.id === id);
  if (!member) return;

  document.getElementById("memberId").value = member.id;
  document.getElementById("memberName").value = member.name;
  document.getElementById("memberEmail").value = member.email || "";
  document.getElementById("memberPhone").value = member.phone || "";

  document.getElementById("memberName").focus();
}

function deleteMember(id) {
  const activeLoan = loans.some(loan =>
    loan.memberId === id && loan.status === "Dipinjam"
  );

  if (activeLoan) {
    alert("Anggota masih memiliki peminjaman aktif dan belum dapat dihapus.");
    return;
  }

  if (!confirm("Yakin ingin menghapus anggota ini?")) return;

  members = members.filter(member => member.id !== id);

  if (localStorage.getItem(STORAGE.memberSession) === id) {
    localStorage.removeItem(STORAGE.memberSession);
  }

  saveMembers();
  renderDashboard();
  renderHome();
}

function resetMemberForm() {
  document.getElementById("memberForm").reset();
  document.getElementById("memberId").value = "";
}

// ==========================================
// CETAK KARTU ANGGOTA
// ==========================================

function printMemberCard(id) {
  const member = members.find(item => item.id === id);
  if (!member) return;

  const barcode = barcodeSVG(member.memberNo, 1.8);

  openPrintWindow("Kartu Anggota " + member.name, `
    <div class="member-card">
      <h2>OCEANVALLE</h2>
      <p>LIBRARY & KNOWLEDGE</p>
      <hr>
      <p class="member-name">${escapeHTML(member.name)}</p>
      <p>Nomor Anggota: <strong>${escapeHTML(member.memberNo)}</strong></p>
      ${barcode}
      <p>OFFICIAL LIBRARY MEMBER CARD</p>
    </div>
  `);
}

// ==========================================
// KATALOG BUKU ADMIN
// ==========================================

function getFilteredAdminBooks() {
  const search = document.getElementById("adminCatalogSearch")
    .value.trim().toLowerCase();

  return books.filter(book =>
    [
      book.code,
      book.title,
      book.author,
      book.category,
      book.publisher,
      book.year
    ].some(value => String(value || "").toLowerCase().includes(search))
  );
}

function renderAdminCatalog() {
  const tbody = document.getElementById("adminCatalogTable");
  if (!tbody) return;

  const filtered = getFilteredAdminBooks();

  tbody.innerHTML = filtered.length
    ? filtered.map((book, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${escapeHTML(book.code)}</td>
        <td>${escapeHTML(book.title)}</td>
        <td>${escapeHTML(book.author)}</td>
        <td>${escapeHTML(book.category)}</td>
        <td>${escapeHTML(book.publisher || "-")}</td>
        <td>${escapeHTML(book.year || "-")}</td>
        <td>${Number(book.available)} / ${Number(book.stock)}</td>
      </tr>
    `).join("")
    : '<tr><td colspan="8">Buku tidak ditemukan.</td></tr>';
}

function printCatalog() {
  if (!requireLogin()) return;

  const filtered = getFilteredAdminBooks();

  const rows = filtered.map((book, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${escapeHTML(book.code)}</td>
      <td>${escapeHTML(book.title)}</td>
      <td>${escapeHTML(book.author)}</td>
      <td>${escapeHTML(book.category)}</td>
      <td>${escapeHTML(book.publisher || "-")}</td>
      <td>${escapeHTML(book.year || "-")}</td>
      <td>${Number(book.available)} / ${Number(book.stock)}</td>
    </tr>
  `).join("");

  openPrintWindow("Katalog Buku Oceanvalle", `
    <h1>OCEANVALLE LIBRARY</h1>
    <h2>Katalog Koleksi Buku</h2>
    <p>Tanggal cetak: ${todayString()}</p>
    <p>Total judul buku: ${filtered.length}</p>
    <table>
      <thead>
        <tr>
          <th>No.</th>
          <th>Kode</th>
          <th>Judul</th>
          <th>Penulis</th>
          <th>Kategori</th>
          <th>Penerbit</th>
          <th>Tahun</th>
          <th>Stok</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `);
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
        ${escapeHTML(member.name)} (${escapeHTML(member.memberNo)})
      </option>
    `).join("");

  bookSelect.innerHTML =
    '<option value="">Pilih buku</option>' +
    books.filter(book => Number(book.available) > 0)
      .map(book => `
        <option value="${escapeHTML(book.id)}">
          ${escapeHTML(book.title)} (tersedia: ${Number(book.available)})
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
      alert("Tanggal jatuh tempo harus sama dengan atau setelah tanggal pinjam.");
      return;
    }

    book.available = Number(book.available) - 1;

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
              ? `<button onclick="returnBook('${loan.id}')">Kembalikan</button>`
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

    const savedPassword =
      localStorage.getItem(STORAGE.password) || "ocean123";

    message.classList.remove("success");

    if (oldPassword !== savedPassword) {
      message.textContent = "Password lama yang kamu masukkan salah.";
      return;
    }

    if (newPassword.length < 6) {
      message.textContent = "Password baru minimal 6 karakter.";
      return;
    }

    if (newPassword === oldPassword) {
      message.textContent = "Password baru harus berbeda dari password lama.";
      return;
    }

    if (newPassword !== confirmPassword) {
      message.textContent = "Konfirmasi password baru tidak cocok.";
      return;
    }

    localStorage.setItem(STORAGE.password, newPassword);

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
  // Hapus sesi login sebelumnya setiap kali website dibuka/di-refresh.
  // Data buku, anggota, peminjaman, dan password admin tidak dihapus.
  localStorage.removeItem(STORAGE.session);
  localStorage.removeItem(STORAGE.memberSession);

  renderHome();

  // Selalu mulai dari halaman Member Login.
  showPage("memberLogin");
});
    category: "Fantasy", year: 2016,
    publisher: "Delacorte Press", stock: 2, available: 2,
    ebookUrl: "assets/ebooks/calamity.pdf"
  },
  {
    id: "book-4", code: "OV0004",
    title: "MADILOG", author: "Tan Malaka",
    category: "Nonfiksi", year: 1943,
    publisher: "", stock: 2, available: 2,
    ebookUrl: "assets/ebooks/madilog.pdf"
  },
  {
    id: "book-5", code: "OV0005",
    title: "Gadis Kretek", author: "Ratih Kumala",
    category: "Fiction", year: 2012,
    publisher: "Gramedia Pustaka Utama", stock: 2, available: 2,
    ebookUrl: "assets/ebooks/gadis-kretek.pdf"
  },
  {
    id: "book-6", code: "OV0006",
    title: "Sang Alkemis", author: "Paulo Coelho",
    category: "Fiction", year: 1988,
    publisher: "", stock: 2, available: 2,
    ebookUrl: "assets/ebooks/sang-alkemis.pdf"
  },
  {
    id: "book-7", code: "OV0007",
    title: "Serbuk Bintang (Stardust)", author: "Neil Gaiman",
    category: "Fantasy", year: 1999,
    publisher: "", stock: 2, available: 2,
    ebookUrl: "assets/ebooks/serbuk-bintang.pdf"
  },
  {
    id: "book-8", code: "OV0008",
    title: "Legend", author: "Marie Lu",
    category: "Dystopian", year: 2011,
    publisher: "", stock: 2, available: 2,
    ebookUrl: "assets/ebooks/legend.pdf"
  },
  {
    id: "book-9", code: "OV0009",
    title: "Pergi", author: "Tere Liye",
    category: "Fiction", year: 2018,
    publisher: "", stock: 2, available: 2,
    ebookUrl: "assets/ebooks/pergi.pdf"
  },
  {
    id: "book-10", code: "OV0010",
    title: "Pulang", author: "Tere Liye",
    category: "Fiction", year: 2015,
    publisher: "", stock: 2, available: 2,
    ebookUrl: "assets/ebooks/pulang.pdf"
  }
];

// ==========================================
// PENYIMPANAN DATA
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

function makeId(prefix) {
  return prefix + "-" + Date.now() + "-" +
    Math.floor(Math.random() * 10000);
}

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
// INISIALISASI DATA
// ==========================================

let books = loadData(STORAGE.books, STARTER_BOOKS);
let members = loadData(STORAGE.members, []);
let loans = loadData(STORAGE.loans, []);

if (!Array.isArray(books)) books = STARTER_BOOKS;
if (!Array.isArray(members)) members = [];
if (!Array.isArray(loans)) loans = [];

books = books.map((book, index) => {
  const starter = STARTER_BOOKS.find(item => item.id === book.id);

  return {
    ...book,
    code: book.code || starter?.code || generateBookCode(index + 11),
    stock: Number(book.stock) || 0,
    available: book.available === undefined
      ? Number(book.stock) || 0
      : Number(book.available),
    ebookUrl: starter?.ebookUrl || book.ebookUrl || ""
  };
});

members = members.map((member, index) => ({
  ...member,
  memberNo: member.memberNo || generateMemberNumber(index + 1)
}));

saveBooks();
saveMembers();

// ==========================================
// GENERATOR KODE BUKU DAN ANGGOTA
// ==========================================

function generateBookCode(number) {
  let code;
  let counter = number;

  do {
    code = "OV" + String(counter).padStart(4, "0");
    counter++;
  } while (books.some(book => book.code === code));

  return code;
}

function generateMemberNumber(number) {
  let code;
  let counter = number;

  do {
    code = "OVM" + String(counter).padStart(4, "0");
    counter++;
  } while (members.some(member => member.memberNo === code));

  return code;
}

// ==========================================
// GENERATOR BARCODE
// ==========================================

function barcodeSVG(value, width = 1.5) {
  if (!window.JsBarcode) {
    return "<span>Barcode tidak dapat dimuat.</span>";
  }

  const svg = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );

  JsBarcode(svg, String(value), {
    format: "CODE128",
    width: width,
    height: 48,
    displayValue: true,
    fontSize: 12,
    margin: 5,
    background: "#ffffff",
    lineColor: "#000000"
  });

  return svg.outerHTML;
}

// ==========================================
// SISTEM LOGIN MEMBER
// ==========================================

function getLoggedInMember() {
  const memberId = localStorage.getItem(STORAGE.memberSession);
  if (!memberId) return null;

  return members.find(member => member.id === memberId) || null;
}

function toggleMemberAuth(section) {
  document.getElementById("memberLoginBox").classList.toggle(
    "hidden", section !== "login"
  );

  document.getElementById("memberRegisterBox").classList.toggle(
    "hidden", section !== "register"
  );

  document.getElementById("memberActivateBox").classList.toggle(
    "hidden", section !== "activate"
  );

  ["memberLoginMessage", "memberRegisterMessage", "memberActivateMessage"]
    .forEach(id => {
      const element = document.getElementById(id);
      if (element) element.textContent = "";
    });
}

document.getElementById("memberLoginForm").addEventListener(
  "submit",
  function(event) {
    event.preventDefault();

    const email = document.getElementById("memberLoginEmail")
      .value.trim().toLowerCase();

    const password = document.getElementById("memberLoginPassword").value;
    const message = document.getElementById("memberLoginMessage");

    const member = members.find(item =>
      String(item.email || "").trim().toLowerCase() === email
    );

    if (!member) {
      message.textContent = "Akun tidak ditemukan. Periksa kembali email kamu.";
      return;
    }

    if (!member.password) {
      message.textContent =
        "Akun belum diaktifkan. Gunakan fitur Aktivasi Akun terlebih dahulu.";
      return;
    }

    if (member.password !== password) {
      message.textContent = "Password yang kamu masukkan salah.";
      return;
    }

    localStorage.removeItem(STORAGE.session);
    localStorage.setItem(STORAGE.memberSession, member.id);

    this.reset();
    showPage("home");
  }
);

// ==========================================
// REGISTRASI MEMBER
// ==========================================

document.getElementById("memberRegisterForm").addEventListener(
  "submit",
  function(event) {
    event.preventDefault();

    const name = document.getElementById("registerMemberName")
      .value.trim();

    const email = document.getElementById("registerMemberEmail")
      .value.trim().toLowerCase();

    const phone = document.getElementById("registerMemberPhone")
      .value.trim();

    const password = document.getElementById("registerMemberPassword").value;
    const confirmPassword =
      document.getElementById("registerMemberConfirm").value;

    const message = document.getElementById("memberRegisterMessage");

    const emailExists = members.some(member =>
      String(member.email || "").trim().toLowerCase() === email
    );

    if (emailExists) {
      message.textContent = "Email sudah terdaftar. Silakan login atau aktivasi akun.";
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

    const member = {
      id: makeId("member"),
      memberNo: generateMemberNumber(members.length + 1),
      name,
      email,
      phone,
      password
    };

    members.push(member);
    saveMembers();

    localStorage.removeItem(STORAGE.session);
    localStorage.setItem(STORAGE.memberSession, member.id);

    this.reset();

    alert(
      "Registrasi berhasil!\nNomor anggota kamu: " +
      member.memberNo
    );

    showPage("home");
  }
);

// ==========================================
// AKTIVASI MEMBER YANG DIBUAT ADMIN
// ==========================================

document.getElementById("memberActivateForm").addEventListener(
  "submit",
  function(event) {
    event.preventDefault();

    const memberNo = document.getElementById("activateMemberNo")
      .value.trim().toUpperCase();

    const email = document.getElementById("activateMemberEmail")
      .value.trim().toLowerCase();

    const password = document.getElementById("activateMemberPassword").value;
    const confirmPassword =
      document.getElementById("activateMemberConfirm").value;

    const message = document.getElementById("memberActivateMessage");

    const member = members.find(item =>
      String(item.memberNo || "").toUpperCase() === memberNo &&
      String(item.email || "").trim().toLowerCase() === email
    );

    if (!member) {
      message.textContent =
        "Data anggota tidak ditemukan. Periksa nomor anggota dan email.";
      return;
    }

    if (member.password) {
      message.textContent =
        "Akun ini sudah aktif. Silakan login menggunakan email dan password.";
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

    member.password = password;
    saveMembers();

    localStorage.removeItem(STORAGE.session);
    localStorage.setItem(STORAGE.memberSession, member.id);

    this.reset();

    alert("Akun berhasil diaktifkan. Selamat datang di Oceanvalle!");

    showPage("home");
  }
);

// ==========================================
// LOGOUT MEMBER
// ==========================================

function logoutMember() {
  localStorage.removeItem(STORAGE.memberSession);
  showPage("memberLogin");
}

// ==========================================
// NAVIGASI HALAMAN
// ==========================================

function showPage(page) {
  const member = getLoggedInMember();
  const isAdmin = localStorage.getItem(STORAGE.session) === "active";

  // Halaman umum yang membutuhkan login member.
  if (
    (page === "home" || page === "collection") &&
    !member
  ) {
    page = "memberLogin";
  }

  // Member tidak dapat membuka dashboard admin.
  if (page === "admin" && !isAdmin) {
    page = "login";
  }

  // Member yang sudah login tidak perlu melihat halaman login lagi.
  if (page === "memberLogin" && member) {
    page = "home";
  }

  document.querySelectorAll(".page").forEach(section => {
    section.classList.add("hidden");
  });

  const pageIds = {
    memberLogin: "memberLoginPage",
    home: "homePage",
    collection: "collectionPage",
    login: "loginPage",
    admin: "adminPage"
  };

  const target = document.getElementById(pageIds[page]);
  if (!target) return;

  target.classList.remove("hidden");

  const logoutButton = document.getElementById("memberLogoutNav");
  if (logoutButton) {
    logoutButton.classList.toggle("hidden", !member);
  }

  const memberLoginButton = document.getElementById("memberLoginNav");
  if (memberLoginButton) {
    memberLoginButton.classList.toggle("hidden", Boolean(member));
  }

  if (page === "home") renderHome();
  if (page === "collection") renderCollection();
  if (page === "admin") renderDashboard();

  if (page === "memberLogin") {
    toggleMemberAuth("login");
  }

  window.scrollTo(0, 0);
}

// ==========================================
// KARTU BUKU
// ==========================================

function bookCard(book) {
  const title = escapeHTML(book.title);
  const author = escapeHTML(book.author);
  const category = escapeHTML(book.category);
  const year = escapeHTML(book.year || "-");

  const ebookButton = book.ebookUrl
    ? `<a href="${escapeHTML(getEbookUrl(book.ebookUrl))}"
         target="_blank" rel="noopener noreferrer">
         Baca Ebook ↗
       </a>`
    : `<span class="hint">File ebook belum ditambahkan.</span>`;

  return `
    <article class="book-card">
      <div class="book-cover"><span>${title}</span></div>
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
// COLLECTION
// ==========================================

function renderCollection() {
  const keyword = document.getElementById("searchBook")
    .value.trim().toLowerCase();

  const filtered = books.filter(book =>
    [book.title, book.author, book.category, book.code]
      .some(value => String(value || "").toLowerCase().includes(keyword))
  );

  document.getElementById("collectionCount").textContent =
    filtered.length + " dari " + books.length + " buku";

  document.getElementById("collectionBooks").innerHTML =
    filtered.length
      ? filtered.map(bookCard).join("")
      : "<p>Buku tidak ditemukan.</p>";
}

// ==========================================
// LOGIN ADMIN
// ==========================================

document.getElementById("loginForm").addEventListener(
  "submit",
  function(event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    const savedPassword =
      localStorage.getItem(STORAGE.password) || "ocean123";

    if (username === "admin" && password === savedPassword) {
      localStorage.removeItem(STORAGE.memberSession);
      localStorage.setItem(STORAGE.session, "active");

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
  showPage("memberLogin");
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
  renderAdminCatalog();
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

  if (tab === "catalog") {
    renderAdminCatalog();
  }
}

// ==========================================
// DATA BUKU
// ==========================================

function renderAdminBooks() {
  const tbody = document.getElementById("adminBooksTable");

  tbody.innerHTML = books.map(book => `
    <tr>
      <td>${escapeHTML(book.code)}</td>
      <td>${escapeHTML(book.title)}</td>
      <td>${escapeHTML(book.author)}</td>
      <td>${escapeHTML(book.category)}</td>
      <td>${Number(book.available)} / ${Number(book.stock)}</td>
      <td class="barcode-cell">${barcodeSVG(book.code, 1)}</td>
      <td>
        <button onclick="printBookBarcode('${book.id}')">Cetak</button>
        <button onclick="editBook('${book.id}')">Edit</button>
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
    const existing = books.find(book => book.id === id);

    const stock = Math.max(0, Number(
      document.getElementById("bookStock").value
    ));

    const borrowed = existing
      ? Number(existing.stock) - Number(existing.available)
      : 0;

    if (stock < borrowed) {
      alert("Stok tidak boleh lebih kecil dari jumlah buku yang sedang dipinjam.");
      return;
    }

    const bookData = {
      id: id || makeId("book"),
      code: existing ? existing.code : generateBookCode(books.length + 1),
      title: document.getElementById("bookTitle").value.trim(),
      author: document.getElementById("bookAuthor").value.trim(),
      category: document.getElementById("bookCategory").value.trim(),
      year: document.getElementById("bookYear").value,
      publisher: document.getElementById("bookPublisher").value.trim(),
      stock,
      available: stock - borrowed,
      ebookUrl: document.getElementById("bookEbook").value.trim()
    };

    if (existing) {
      books = books.map(book => book.id === id ? bookData : book);
    } else {
      books.push(bookData);
    }

    saveBooks();
    resetBookForm();
    renderDashboard();
    renderHome();
    renderCollection();

    alert("Data buku berhasil disimpan. Kode dan barcode buku sudah dibuat.");
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
  document.getElementById("bookEbook").value = book.ebookUrl || "";

  document.getElementById("bookTitle").focus();
  window.scrollTo(0, 0);
}

function deleteBook(id) {
  const activeLoan = loans.some(loan =>
    loan.bookId === id && loan.status === "Dipinjam"
  );

  if (activeLoan) {
    alert("Buku masih memiliki peminjaman aktif dan tidak dapat dihapus.");
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
// CETAK BARCODE BUKU
// ==========================================

function openPrintWindow(title, content) {
  const printWindow = window.open("", "_blank");

  if (!printWindow) {
    alert("Popup diblokir browser. Izinkan pop-up untuk mencetak.");
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
          font-family: Arial, sans-serif;
          color: #302D29;
          padding: 25px;
        }
        h1 { color: #503923; }
        table { width: 100%; border-collapse: collapse; }
        th, td {
          border: 1px solid #ddd;
          padding: 9px;
          text-align: left;
          font-size: 11px;
        }
        th { background: #f3f0e9; }
        .barcode-label {
          display: inline-block;
          border: 1px solid #ddd;
          padding: 12px;
          margin: 8px;
          text-align: center;
          background: white;
          break-inside: avoid;
        }
        .barcode-label svg { max-width: 100%; height: auto; }
        .member-card {
          width: 340px;
          min-height: 210px;
          border: 2px solid #775537;
          border-radius: 12px;
          padding: 18px;
          margin: 15px auto;
          text-align: center;
        }
        .member-card h2 { color: #775537; margin: 5px; }
        .member-card .member-name { font-size: 18px; font-weight: bold; }
        .member-card svg { max-width: 100%; }
        .member-card p { font-size: 11px; }
        .print-button {
          background: #775537;
          color: white;
          padding: 10px 20px;
          border: 0;
          border-radius: 4px;
          cursor: pointer;
          margin-bottom: 20px;
        }
        @media print {
          body { padding: 0; }
          .print-button { display: none; }
        }
      </style>
    </head>
    <body>
      <button class="print-button" onclick="window.print()">Cetak</button>
      ${content}
    </body>
    </html>
  `);
  printWindow.document.close();
}

function printBookBarcode(id) {
  const book = books.find(item => item.id === id);
  if (!book) return;

  const barcode = barcodeSVG(book.code, 2);

  openPrintWindow("Barcode Buku " + book.title, `
    <div class="barcode-label">
      <strong>OCEANVALLE LIBRARY</strong>
      <p>${escapeHTML(book.title)}</p>
      ${barcode}
      <small>${escapeHTML(book.code)}</small>
    </div>
  `);
}

// ==========================================
// DATA ANGGOTA
// ==========================================

function renderAdminMembers() {
  document.getElementById("adminMembersTable").innerHTML =
    members.map(member => `
      <tr>
        <td>${escapeHTML(member.memberNo)}</td>
        <td>${escapeHTML(member.name)}</td>
        <td>${escapeHTML(member.email || "-")}</td>
        <td>${escapeHTML(member.phone || "-")}</td>
        <td>
          <button onclick="printMemberCard('${member.id}')">Cetak Kartu</button>
        </td>
        <td>
          <button onclick="editMember('${member.id}')">Edit</button>
          <button class="delete" onclick="deleteMember('${member.id}')">Hapus</button>
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
    const existing = members.find(member => member.id === id);

    const email = document.getElementById("memberEmail")
      .value.trim().toLowerCase();

    const duplicateEmail = members.some(member =>
      member.id !== id &&
      String(member.email || "").trim().toLowerCase() === email &&
      email !== ""
    );

    if (duplicateEmail) {
      alert("Email tersebut sudah digunakan oleh anggota lain.");
      return;
    }

    const memberData = {
      ...(existing || {}),
      id: id || makeId("member"),
      memberNo: existing
        ? existing.memberNo
        : generateMemberNumber(members.length + 1),
      name: document.getElementById("memberName").value.trim(),
      email,
      phone: document.getElementById("memberPhone").value.trim()
    };

    if (existing) {
      members = members.map(member =>
        member.id === id ? memberData : member
      );
    } else {
      members.push(memberData);
    }

    saveMembers();
    resetMemberForm();
    renderDashboard();
    renderHome();

    alert(
      existing
        ? "Data anggota berhasil diperbarui."
        : "Data anggota berhasil disimpan. Anggota dapat mengaktifkan akun melalui halaman Member Login."
    );
  }
);

function editMember(id) {
  const member = members.find(item => item.id === id);
  if (!member) return;

  document.getElementById("memberId").value = member.id;
  document.getElementById("memberName").value = member.name;
  document.getElementById("memberEmail").value = member.email || "";
  document.getElementById("memberPhone").value = member.phone || "";

  document.getElementById("memberName").focus();
}

function deleteMember(id) {
  const activeLoan = loans.some(loan =>
    loan.memberId === id && loan.status === "Dipinjam"
  );

  if (activeLoan) {
    alert("Anggota masih memiliki peminjaman aktif dan belum dapat dihapus.");
    return;
  }

  if (!confirm("Yakin ingin menghapus anggota ini?")) return;

  members = members.filter(member => member.id !== id);

  if (localStorage.getItem(STORAGE.memberSession) === id) {
    localStorage.removeItem(STORAGE.memberSession);
  }

  saveMembers();
  renderDashboard();
  renderHome();
}

function resetMemberForm() {
  document.getElementById("memberForm").reset();
  document.getElementById("memberId").value = "";
}

// ==========================================
// CETAK KARTU ANGGOTA
// ==========================================

function printMemberCard(id) {
  const member = members.find(item => item.id === id);
  if (!member) return;

  const barcode = barcodeSVG(member.memberNo, 1.8);

  openPrintWindow("Kartu Anggota " + member.name, `
    <div class="member-card">
      <h2>OCEANVALLE</h2>
      <p>LIBRARY & KNOWLEDGE</p>
      <hr>
      <p class="member-name">${escapeHTML(member.name)}</p>
      <p>Nomor Anggota: <strong>${escapeHTML(member.memberNo)}</strong></p>
      ${barcode}
      <p>OFFICIAL LIBRARY MEMBER CARD</p>
    </div>
  `);
}

// ==========================================
// KATALOG BUKU ADMIN
// ==========================================

function getFilteredAdminBooks() {
  const search = document.getElementById("adminCatalogSearch")
    .value.trim().toLowerCase();

  return books.filter(book =>
    [
      book.code,
      book.title,
      book.author,
      book.category,
      book.publisher,
      book.year
    ].some(value => String(value || "").toLowerCase().includes(search))
  );
}

function renderAdminCatalog() {
  const tbody = document.getElementById("adminCatalogTable");
  if (!tbody) return;

  const filtered = getFilteredAdminBooks();

  tbody.innerHTML = filtered.length
    ? filtered.map((book, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${escapeHTML(book.code)}</td>
        <td>${escapeHTML(book.title)}</td>
        <td>${escapeHTML(book.author)}</td>
        <td>${escapeHTML(book.category)}</td>
        <td>${escapeHTML(book.publisher || "-")}</td>
        <td>${escapeHTML(book.year || "-")}</td>
        <td>${Number(book.available)} / ${Number(book.stock)}</td>
      </tr>
    `).join("")
    : '<tr><td colspan="8">Buku tidak ditemukan.</td></tr>';
}

function printCatalog() {
  if (!requireLogin()) return;

  const filtered = getFilteredAdminBooks();

  const rows = filtered.map((book, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${escapeHTML(book.code)}</td>
      <td>${escapeHTML(book.title)}</td>
      <td>${escapeHTML(book.author)}</td>
      <td>${escapeHTML(book.category)}</td>
      <td>${escapeHTML(book.publisher || "-")}</td>
      <td>${escapeHTML(book.year || "-")}</td>
      <td>${Number(book.available)} / ${Number(book.stock)}</td>
    </tr>
  `).join("");

  openPrintWindow("Katalog Buku Oceanvalle", `
    <h1>OCEANVALLE LIBRARY</h1>
    <h2>Katalog Koleksi Buku</h2>
    <p>Tanggal cetak: ${todayString()}</p>
    <p>Total judul buku: ${filtered.length}</p>
    <table>
      <thead>
        <tr>
          <th>No.</th>
          <th>Kode</th>
          <th>Judul</th>
          <th>Penulis</th>
          <th>Kategori</th>
          <th>Penerbit</th>
          <th>Tahun</th>
          <th>Stok</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `);
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
        ${escapeHTML(member.name)} (${escapeHTML(member.memberNo)})
      </option>
    `).join("");

  bookSelect.innerHTML =
    '<option value="">Pilih buku</option>' +
    books.filter(book => Number(book.available) > 0)
      .map(book => `
        <option value="${escapeHTML(book.id)}">
          ${escapeHTML(book.title)} (tersedia: ${Number(book.available)})
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
      alert("Tanggal jatuh tempo harus sama dengan atau setelah tanggal pinjam.");
      return;
    }

    book.available = Number(book.available) - 1;

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
              ? `<button onclick="returnBook('${loan.id}')">Kembalikan</button>`
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

    const savedPassword =
      localStorage.getItem(STORAGE.password) || "ocean123";

    message.classList.remove("success");

    if (oldPassword !== savedPassword) {
      message.textContent = "Password lama yang kamu masukkan salah.";
      return;
    }

    if (newPassword.length < 6) {
      message.textContent = "Password baru minimal 6 karakter.";
      return;
    }

    if (newPassword === oldPassword) {
      message.textContent = "Password baru harus berbeda dari password lama.";
      return;
    }

    if (newPassword !== confirmPassword) {
      message.textContent = "Konfirmasi password baru tidak cocok.";
      return;
    }

    localStorage.setItem(STORAGE.password, newPassword);

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

  const adminSession = localStorage.getItem(STORAGE.session);
  const member = getLoggedInMember();

  if (adminSession === "active") {
    showPage("admin");
  } else if (member) {
    showPage("home");
  } else {
    showPage("memberLogin");
  }
});
    year: 2013,
    publisher: "Delacorte Press",
    stock: 2,
    available: 2,
    ebookUrl: "assets/ebooks/steelheart.pdf"
  },
  {
    id: "book-3",
    code: "OV0003",
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
    code: "OV0004",
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
    code: "OV0005",
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
    code: "OV0006",
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
    code: "OV0007",
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
    code: "OV0008",
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
    code: "OV0009",
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
    code: "OV0010",
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
// PENYIMPANAN DATA
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

function makeId(prefix) {
  return prefix + "-" + Date.now() + "-" +
    Math.floor(Math.random() * 10000);
}

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
// INISIALISASI DATA
// ==========================================

let books = loadData(STORAGE.books, STARTER_BOOKS);
let members = loadData(STORAGE.members, []);
let loans = loadData(STORAGE.loans, []);

if (!Array.isArray(books)) books = STARTER_BOOKS;
if (!Array.isArray(members)) members = [];
if (!Array.isArray(loans)) loans = [];

// Mempertahankan data lama dan menambahkan kode otomatis.

books = books.map((book, index) => {
  const starter = STARTER_BOOKS.find(item => item.id === book.id);

  return {
    ...book,
    code: book.code || starter?.code || generateBookCode(index + 11),
    stock: Number(book.stock) || 0,
    available: book.available === undefined
      ? Number(book.stock) || 0
      : Number(book.available),
    ebookUrl: starter?.ebookUrl || book.ebookUrl || ""
  };
});

members = members.map((member, index) => ({
  ...member,
  memberNo: member.memberNo || generateMemberNumber(index + 1)
}));

saveBooks();
saveMembers();

// ==========================================
// GENERATOR KODE BUKU DAN ANGGOTA
// ==========================================

function generateBookCode(number) {
  let code;
  let counter = number;

  do {
    code = "OV" + String(counter).padStart(4, "0");
    counter++;
  } while (books.some(book => book.code === code));

  return code;
}

function generateMemberNumber(number) {
  let code;
  let counter = number;

  do {
    code = "OVM" + String(counter).padStart(4, "0");
    counter++;
  } while (members.some(member => member.memberNo === code));

  return code;
}

// ==========================================
// GENERATOR BARCODE
// ==========================================

function barcodeSVG(value, width = 1.5) {
  if (!window.JsBarcode) {
    return "<span>Barcode tidak dapat dimuat.</span>";
  }

  const svg = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );

  JsBarcode(svg, String(value), {
    format: "CODE128",
    width: width,
    height: 48,
    displayValue: true,
    fontSize: 12,
    margin: 5,
    background: "#ffffff",
    lineColor: "#000000"
  });

  return svg.outerHTML;
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
// KARTU BUKU
// ==========================================

function bookCard(book) {
  const title = escapeHTML(book.title);
  const author = escapeHTML(book.author);
  const category = escapeHTML(book.category);
  const year = escapeHTML(book.year || "-");

  const ebookButton = book.ebookUrl
    ? `<a href="${escapeHTML(getEbookUrl(book.ebookUrl))}"
         target="_blank" rel="noopener noreferrer">
         Baca Ebook ↗
       </a>`
    : `<span class="hint">File ebook belum ditambahkan.</span>`;

  return `
    <article class="book-card">
      <div class="book-cover"><span>${title}</span></div>
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
// COLLECTION
// ==========================================

function renderCollection() {
  const keyword = document.getElementById("searchBook")
    .value.trim().toLowerCase();

  const filtered = books.filter(book =>
    [book.title, book.author, book.category, book.code]
      .some(value => String(value || "").toLowerCase().includes(keyword))
  );

  document.getElementById("collectionCount").textContent =
    filtered.length + " dari " + books.length + " buku";

  document.getElementById("collectionBooks").innerHTML =
    filtered.length
      ? filtered.map(bookCard).join("")
      : "<p>Buku tidak ditemukan.</p>";
}

// ==========================================
// LOGIN ADMIN
// ==========================================

document.getElementById("loginForm").addEventListener("submit", function(event) {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  const savedPassword =
    localStorage.getItem(STORAGE.password) || "ocean123";

  if (username === "admin" && password === savedPassword) {
    localStorage.setItem(STORAGE.session, "active");

    document.getElementById("loginMessage").textContent = "";
    this.reset();

    showPage("admin");
  } else {
    document.getElementById("loginMessage").textContent =
      "Username atau password salah. Silakan coba lagi.";
  }
});

function requireLogin() {
  if (localStorage.getItem(STORAGE.session) !== "active") {
    showPage("login");
    return false;
  }

  return true;
}

function logout() {
  localStorage.removeItem(STORAGE.session);
  showPage("home");
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
    loans.filter(loan => loan.status === "Dipinjam" && isOverdue(loan)).length;

  renderAdminBooks();
  renderAdminMembers();
  renderAdminCatalog();
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

  if (tab === "catalog") {
    renderAdminCatalog();
  }
}

// ==========================================
// DATA BUKU
// ==========================================

function renderAdminBooks() {
  const tbody = document.getElementById("adminBooksTable");

  tbody.innerHTML = books.map(book => `
    <tr>
      <td>${escapeHTML(book.code)}</td>
      <td>${escapeHTML(book.title)}</td>
      <td>${escapeHTML(book.author)}</td>
      <td>${escapeHTML(book.category)}</td>
      <td>${Number(book.available)} / ${Number(book.stock)}</td>
      <td class="barcode-cell">
        ${barcodeSVG(book.code, 1)}
      </td>
      <td>
        <button onclick="printBookBarcode('${book.id}')">Cetak</button>
        <button onclick="editBook('${book.id}')">Edit</button>
        <button class="delete" onclick="deleteBook('${book.id}')">Hapus</button>
      </td>
    </tr>
  `).join("");
}

document.getElementById("bookForm").addEventListener("submit", function(event) {
  event.preventDefault();

  if (!requireLogin()) return;

  const id = document.getElementById("bookId").value;
  const existing = books.find(book => book.id === id);

  const stock = Math.max(0, Number(
    document.getElementById("bookStock").value
  ));

  const borrowed = existing
    ? Number(existing.stock) - Number(existing.available)
    : 0;

  if (stock < borrowed) {
    alert("Stok tidak boleh lebih kecil dari jumlah buku yang sedang dipinjam.");
    return;
  }

  const bookData = {
    id: id || makeId("book"),
    code: existing ? existing.code : generateBookCode(books.length + 1),
    title: document.getElementById("bookTitle").value.trim(),
    author: document.getElementById("bookAuthor").value.trim(),
    category: document.getElementById("bookCategory").value.trim(),
    year: document.getElementById("bookYear").value,
    publisher: document.getElementById("bookPublisher").value.trim(),
    stock: stock,
    available: stock - borrowed,
    ebookUrl: document.getElementById("bookEbook").value.trim()
  };

  if (existing) {
    books = books.map(book => book.id === id ? bookData : book);
  } else {
    books.push(bookData);
  }

  saveBooks();
  resetBookForm();
  renderDashboard();
  renderHome();
  renderCollection();

  alert("Data buku berhasil disimpan. Kode dan barcode buku sudah dibuat.");
});

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
  document.getElementById("bookEbook").value = book.ebookUrl || "";

  document.getElementById("bookTitle").focus();
  window.scrollTo(0, 0);
}

function deleteBook(id) {
  const activeLoan = loans.some(loan =>
    loan.bookId === id && loan.status === "Dipinjam"
  );

  if (activeLoan) {
    alert("Buku masih memiliki peminjaman aktif dan tidak dapat dihapus.");
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
// CETAK BARCODE BUKU
// ==========================================

function openPrintWindow(title, content) {
  const printWindow = window.open("", "_blank");

  if (!printWindow) {
    alert("Popup diblokir browser. Izinkan pop-up untuk mencetak.");
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
          font-family: Arial, sans-serif;
          color: #302D29;
          padding: 25px;
        }
        h1 { color: #503923; }
        table { width: 100%; border-collapse: collapse; }
        th, td {
          border: 1px solid #ddd;
          padding: 9px;
          text-align: left;
          font-size: 11px;
        }
        th { background: #f3f0e9; }
        .barcode-label {
          display: inline-block;
          border: 1px solid #ddd;
          padding: 12px;
          margin: 8px;
          text-align: center;
          background: white;
          break-inside: avoid;
        }
        .barcode-label svg { max-width: 100%; height: auto; }
        .member-card {
          width: 340px;
          min-height: 210px;
          border: 2px solid #775537;
          border-radius: 12px;
          padding: 18px;
          margin: 15px auto;
          text-align: center;
        }
        .member-card h2 { color: #775537; margin: 5px; }
        .member-card .member-name { font-size: 18px; font-weight: bold; }
        .member-card svg { max-width: 100%; }
        .member-card p { font-size: 11px; }
        .print-button {
          background: #775537;
          color: white;
          padding: 10px 20px;
          border: 0;
          border-radius: 4px;
          cursor: pointer;
          margin-bottom: 20px;
        }
        @media print {
          body { padding: 0; }
          .print-button { display: none; }
        }
      </style>
    </head>
    <body>
      <button class="print-button" onclick="window.print()">Cetak</button>
      ${content}
    </body>
    </html>
  `);
  printWindow.document.close();
}

function printBookBarcode(id) {
  const book = books.find(item => item.id === id);
  if (!book) return;

  const barcode = barcodeSVG(book.code, 2);

  openPrintWindow("Barcode Buku " + book.title, `
    <div class="barcode-label">
      <strong>OCEANVALLE LIBRARY</strong>
      <p>${escapeHTML(book.title)}</p>
      ${barcode}
      <small>${escapeHTML(book.code)}</small>
    </div>
  `);
}

// ==========================================
// DATA ANGGOTA
// ==========================================

function renderAdminMembers() {
  document.getElementById("adminMembersTable").innerHTML =
    members.map(member => `
      <tr>
        <td>${escapeHTML(member.memberNo)}</td>
        <td>${escapeHTML(member.name)}</td>
        <td>${escapeHTML(member.email || "-")}</td>
        <td>${escapeHTML(member.phone || "-")}</td>
        <td>
          <button onclick="printMemberCard('${member.id}')">Cetak Kartu</button>
        </td>
        <td>
          <button onclick="editMember('${member.id}')">Edit</button>
          <button class="delete" onclick="deleteMember('${member.id}')">Hapus</button>
        </td>
      </tr>
    `).join("");
}

document.getElementById("memberForm").addEventListener("submit", function(event) {
  event.preventDefault();

  if (!requireLogin()) return;

  const id = document.getElementById("memberId").value;
  const existing = members.find(member => member.id === id);

  const memberData = {
    id: id || makeId("member"),
    memberNo: existing
      ? existing.memberNo
      : generateMemberNumber(members.length + 1),
    name: document.getElementById("memberName").value.trim(),
    email: document.getElementById("memberEmail").value.trim(),
    phone: document.getElementById("memberPhone").value.trim()
  };

  if (existing) {
    members = members.map(member =>
      member.id === id ? memberData : member
    );
  } else {
    members.push(memberData);
  }

  saveMembers();
  resetMemberForm();
  renderDashboard();
  renderHome();

  alert("Data anggota berhasil disimpan.");
});

function editMember(id) {
  const member = members.find(item => item.id === id);
  if (!member) return;

  document.getElementById("memberId").value = member.id;
  document.getElementById("memberName").value = member.name;
  document.getElementById("memberEmail").value = member.email || "";
  document.getElementById("memberPhone").value = member.phone || "";

  document.getElementById("memberName").focus();
}

function deleteMember(id) {
  const activeLoan = loans.some(loan =>
    loan.memberId === id && loan.status === "Dipinjam"
  );

  if (activeLoan) {
    alert("Anggota masih memiliki peminjaman aktif dan belum dapat dihapus.");
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
// CETAK KARTU ANGGOTA
// ==========================================

function printMemberCard(id) {
  const member = members.find(item => item.id === id);
  if (!member) return;

  const barcode = barcodeSVG(member.memberNo, 1.8);

  openPrintWindow("Kartu Anggota " + member.name, `
    <div class="member-card">
      <h2>OCEANVALLE</h2>
      <p>LIBRARY & KNOWLEDGE</p>
      <hr>
      <p class="member-name">${escapeHTML(member.name)}</p>
      <p>Nomor Anggota: <strong>${escapeHTML(member.memberNo)}</strong></p>
      ${barcode}
      <p>OFFICIAL LIBRARY MEMBER CARD</p>
    </div>
  `);
}

// ==========================================
// KATALOG BUKU ADMIN
// ==========================================

function renderAdminCatalog() {
  const tbody = document.getElementById("adminCatalogTable");
  if (!tbody) return;

  const search = document.getElementById("adminCatalogSearch")
    .value.trim().toLowerCase();

  const filtered = books.filter(book =>
    [
      book.code,
      book.title,
      book.author,
      book.category,
      book.publisher,
      book.year
    ].some(value => String(value || "").toLowerCase().includes(search))
  );

  tbody.innerHTML = filtered.length
    ? filtered.map((book, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${escapeHTML(book.code)}</td>
        <td>${escapeHTML(book.title)}</td>
        <td>${escapeHTML(book.author)}</td>
        <td>${escapeHTML(book.category)}</td>
        <td>${escapeHTML(book.publisher || "-")}</td>
        <td>${escapeHTML(book.year || "-")}</td>
        <td>${Number(book.available)} / ${Number(book.stock)}</td>
      </tr>
    `).join("")
    : '<tr><td colspan="8">Buku tidak ditemukan.</td></tr>';
}

function printCatalog() {
  if (!requireLogin()) return;

  const search = document.getElementById("adminCatalogSearch")
    .value.trim().toLowerCase();

  const filtered = books.filter(book =>
    [
      book.code,
      book.title,
      book.author,
      book.category,
      book.publisher,
      book.year
    ].some(value => String(value || "").toLowerCase().includes(search))
  );

  const rows = filtered.map((book, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${escapeHTML(book.code)}</td>
      <td>${escapeHTML(book.title)}</td>
      <td>${escapeHTML(book.author)}</td>
      <td>${escapeHTML(book.category)}</td>
      <td>${escapeHTML(book.publisher || "-")}</td>
      <td>${escapeHTML(book.year || "-")}</td>
      <td>${Number(book.available)} / ${Number(book.stock)}</td>
    </tr>
  `).join("");

  openPrintWindow("Katalog Buku Oceanvalle", `
    <h1>OCEANVALLE LIBRARY</h1>
    <h2>Katalog Koleksi Buku</h2>
    <p>Tanggal cetak: ${todayString()}</p>
    <p>Total judul buku: ${filtered.length}</p>
    <table>
      <thead>
        <tr>
          <th>No.</th>
          <th>Kode</th>
          <th>Judul</th>
          <th>Penulis</th>
          <th>Kategori</th>
          <th>Penerbit</th>
          <th>Tahun</th>
          <th>Stok</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `);
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
        ${escapeHTML(member.name)} (${escapeHTML(member.memberNo)})
      </option>
    `).join("");

  bookSelect.innerHTML =
    '<option value="">Pilih buku</option>' +
    books.filter(book => Number(book.available) > 0)
      .map(book => `
        <option value="${escapeHTML(book.id)}">
          ${escapeHTML(book.title)} (tersedia: ${Number(book.available)})
        </option>
      `).join("");

  if (!document.getElementById("loanDate").value) {
    document.getElementById("loanDate").value = todayString();
  }
}

document.getElementById("loanForm").addEventListener("submit", function(event) {
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
    alert("Tanggal jatuh tempo harus sama dengan atau setelah tanggal pinjam.");
    return;
  }

  book.available = Number(book.available) - 1;

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
});

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
              ? `<button onclick="returnBook('${loan.id}')">Kembalikan</button>`
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

document.getElementById("passwordForm").addEventListener("submit", function(event) {
  event.preventDefault();

  if (!requireLogin()) return;

  const oldPassword = document.getElementById("oldPassword").value;
  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const message = document.getElementById("passwordMessage");

  const savedPassword =
    localStorage.getItem(STORAGE.password) || "ocean123";

  message.classList.remove("success");

  if (oldPassword !== savedPassword) {
    message.textContent = "Password lama yang kamu masukkan salah.";
    return;
  }

  if (newPassword.length < 6) {
    message.textContent = "Password baru minimal 6 karakter.";
    return;
  }

  if (newPassword === oldPassword) {
    message.textContent = "Password baru harus berbeda dari password lama.";
    return;
  }

  if (newPassword !== confirmPassword) {
    message.textContent = "Konfirmasi password baru tidak cocok.";
    return;
  }

  localStorage.setItem(STORAGE.password, newPassword);

  this.reset();

  message.textContent =
    "Password berhasil diganti. Gunakan password baru saat login berikutnya.";

  message.classList.add("success");
});

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
