import { Topic, Question, ExamConfig } from '../types';

export const INITIAL_TOPICS: Topic[] = [
  {
    id: 'topic-1',
    code: 'CD1',
    title: 'Sử dụng máy tính và các công cụ số',
    description: 'Hệ điều hành, phần cứng máy tính, quản lý tệp và thư mục, kết nối thiết bị ngoại vi và mạng cục bộ (LAN).',
    iconName: 'Cpu',
    badge: 'Cơ bản & Nền tảng',
    objectives: [
      'Phân biệt chức năng của các thành phần phần cứng và thiết bị số.',
      'Sử dụng thành thạo hệ điều hành (Windows, Linux, macOS), quản lý tiến trình và tài nguyên.',
      'Hiểu nguyên lý hoạt động của mạng LAN, địa chỉ IP, Router và Switch.',
      'Thiết lập chia sẻ dữ liệu và máy in trong mạng cục bộ an toàn.',
    ],
    lessons: [
      {
        id: 'lesson-1-1',
        topicId: 'topic-1',
        title: 'Bài 1: Hệ điều hành và quản lý tài nguyên máy tính',
        order: 1,
        summary: 'Vai trò của hệ điều hành làm trung gian giữa phần cứng và người dùng, quản lý bộ nhớ, CPU, tệp và tiến trình.',
        fullTheory: `### 1. Khái niệm và vai trò của Hệ điều hành (OS)
Hệ điều hành là tập hợp các chương trình có nhiệm vụ quản lý, điều phối tài nguyên phần cứng (CPU, RAM, ổ đĩa, thiết bị ngoại vi) và cung cấp môi trường giao tiếp cho người dùng cùng các ứng dụng.

### 2. Các chức năng cốt lõi:
- **Quản lý tiến trình (Process Management):** Điều phối CPU theo thuật toán (Round Robin, FIFO, Priority), cấp phát thời gian xử lý đa nhiệm (multitasking).
- **Quản lý bộ nhớ (Memory Management):** Cấp phát và giải phóng không gian RAM, sử dụng cơ chế bộ nhớ ảo (Virtual Memory / Paging).
- **Quản lý hệ thống tệp (File System):** Tổ chức dữ liệu theo cây thư mục phân cấp (NTFS, FAT32, ext4), phân quyền đọc/ghi/thực thi.
- **Quản lý thiết bị (Device Management):** Giao tiếp thông qua trình điều khiển thiết bị (Device Driver).

### 3. Giao diện người dùng:
- Giao diện dòng lệnh (CLI - Command Line Interface): Command Prompt, PowerShell, Terminal.
- Giao diện đồ họa (GUI - Graphical User Interface): Cửa sổ, biểu tượng, chuột, cảm ứng.`,
        keyTakeaways: [
          'Hệ điều hành là phần mềm hệ thống không thể thiếu trên mọi thiết bị số.',
          'Bộ nhớ ảo (Virtual Memory) kết hợp dung lượng RAM với một phần ổ cứng khi RAM đầy.',
          'Device Driver là cầu nối bắt buộc để hệ điều hành nhận biết và điều khiển thiết bị ngoại vi.',
        ],
        commonPitfalls: [
          'Nhầm lẫn giữa phần mềm hệ thống (Hệ điều hành) và phần mềm ứng dụng (Word, Trình duyệt).',
          'Nghĩ rằng tắt ứng dụng ở cửa sổ là đã dừng hoàn toàn tiến trình chạy ngầm (cần kiểm tra Task Manager).',
        ],
        examples: [
          {
            title: 'Khởi động máy tính và quá trình POST/Boot',
            description: 'Khi bật nguồn, ROM-BIOS kiểm tra phần cứng (POST), sau đó nạp Bootloader từ ổ cứng vào RAM để khởi động hệ điều hành.',
          },
          {
            title: 'Sử dụng Task Manager xử lý phần mềm bị treo',
            description: 'Bấm tổ hợp Ctrl + Shift + Esc để mở Task Manager, tìm ứng dụng không phản hồi (Not Responding) và chọn "End Task" để thu hồi tài nguyên CPU/RAM.',
          },
        ],
        quickCheckQuestionIds: ['q-101', 'q-102'],
      },
      {
        id: 'lesson-1-2',
        topicId: 'topic-1',
        title: 'Bài 2: Mạng cục bộ (LAN) và kết nối thiết bị số',
        order: 2,
        summary: 'Kiến trúc mạng LAN, cáp mạng xoắn đôi, Wi-Fi, Switch, Router và cấu hình địa chỉ IP.',
        fullTheory: `### 1. Khái niệm Mạng cục bộ (LAN - Local Area Network)
Mạng LAN kết nối các máy tính và thiết bị số trong phạm vi địa lý hẹp như phòng học, văn phòng, gia đình.

### 2. Các thiết bị mạng cơ bản:
- **Switch (Bộ chuyển mạch):** Kết nối các thiết bị trong cùng mạng LAN, chuyển tiếp dữ liệu dựa trên địa chỉ MAC (tầng Liên kết dữ liệu).
- **Router (Bộ định tuyến):** Kết nối mạng LAN với mạng Internet (WAN), định tuyến gói tin dựa trên địa chỉ IP (tầng Mạng).
- **Access Point (Điểm truy cập không dây):** Phát sóng Wi-Fi cho các thiết bị kết nối vào mạng LAN.
- **Modem:** Điều chế và giải điều chế tín hiệu từ nhà mạng (ISP).

### 3. Địa chỉ IP và Subnet Mask:
- **IPv4:** Gồm 32 bit, chia thành 4 octet thập phân (ví dụ: 192.168.1.10).
- **Dải IP riêng (Private IP):** Dùng trong nội bộ mạng LAN (ví dụ: 192.168.x.x, 10.x.x.x).
- **DHCP (Dynamic Host Configuration Protocol):** Giao thức tự động cấp phát địa chỉ IP cho thiết bị khi gia nhập mạng.`,
        keyTakeaways: [
          'Switch làm việc theo địa chỉ MAC trong mạng nội bộ, Router làm việc theo địa chỉ IP để kết nối liên mạng.',
          'Địa chỉ IP nội bộ (Private IP) không thể định tuyến trực tiếp trên mạng Internet công cộng.',
          'DHCP giúp thiết bị tự nhận IP mà không cần nhập tay.',
        ],
        commonPitfalls: [
          'Nhầm lẫn chức năng giữa Router (định tuyến giữa các mạng) và Switch (kết nối nội bộ).',
          'Tưởng rằng đổi tên Wi-Fi (SSID) là thay đổi địa chỉ IP của mạng.',
        ],
        examples: [
          {
            title: 'Chia sẻ máy in trong phòng thực hành Tin học',
            description: 'Kết nối máy in vào một máy chủ trong mạng LAN, bật tính năng Share Printer, các máy trạm cùng dải IP có thể gửi lệnh in.',
          },
        ],
        quickCheckQuestionIds: ['q-103', 'q-104'],
      },
    ],
  },
  {
    id: 'topic-2',
    code: 'CD2',
    title: 'Ứng dụng CNTT trong học tập và đời sống',
    description: 'Điện toán đám mây, lưu trữ trực tuyến, công cụ làm việc cộng tác và quản lý học tập số.',
    iconName: 'Cloud',
    badge: 'Thực tiễn & Đời sống',
    objectives: [
      'Hiểu bản chất và lợi ích của dịch vụ điện toán đám mây (Cloud Computing).',
      'Sử dụng các dịch vụ lưu trữ trực tuyến (Google Drive, OneDrive) để sao lưu và chia sẻ dữ liệu.',
      'Cộng tác đồng bộ theo thời gian thực trên các ứng dụng văn phòng trực tuyến.',
      'Phân quyền truy cập tài liệu: Viewer (Xem), Commenter (Nhận xét), Editor (Chỉnh sửa).',
    ],
    lessons: [
      {
        id: 'lesson-2-1',
        topicId: 'topic-2',
        title: 'Bài 1: Điện toán đám mây và Lưu trữ trực tuyến',
        order: 1,
        summary: 'Mô hình dịch vụ IaaS, PaaS, SaaS, ưu điểm về khả năng truy cập mọi lúc mọi nơi và tự động sao lưu.',
        fullTheory: `### 1. Điện toán đám mây (Cloud Computing)
Là mô hình cung cấp các tài nguyên máy tính (máy chủ, lưu trữ, cơ sở dữ liệu, phần mềm) qua mạng Internet theo nhu cầu sử dụng.

### 2. Các mô hình dịch vụ chính:
- **SaaS (Phần mềm như một dịch vụ):** Người dùng dùng trực tiếp phần mềm qua web/app (Google Docs, Office 365, Gmail).
- **PaaS (Nền tảng như một dịch vụ):** Cung cấp môi trường để lập trình viên phát triển ứng dụng (Google App Engine, Vercel).
- **IaaS (Hạ tầng như một dịch vụ):** Cung cấp tài nguyên phần cứng ảo hóa (AWS EC2, Google Compute Engine).

### 3. Lưu trữ đám mây (Cloud Storage):
- Dữ liệu được lưu trên các trung tâm dữ liệu (Data Center) phân tán.
- Tự động đồng bộ (Sync) giữa máy tính, điện thoại và máy chủ.
- Tính năng phiên bản lịch sử (Version History) cho phép khôi phục khi bị sửa đổi nhầm.`,
        keyTakeaways: [
          'SaaS là mô hình phổ biến nhất với học sinh (sử dụng ứng dụng trực tiếp trên nền web).',
          'Lưu trữ đám mây giúp chống mất mát dữ liệu khi thiết bị cá nhân bị hỏng hoặc mất cắp.',
          'Tính năng Version History lưu lại các mốc thời gian sửa đổi giúp hoàn tác an toàn.',
        ],
        commonPitfalls: [
          'Cho rằng dữ liệu lưu trên đám mây là an toàn tuyệt đối mà không cần đặt mật khẩu mạnh hoặc bảo vệ 2 lớp.',
        ],
        examples: [
          {
            title: 'Làm bài thuyết trình nhóm qua Google Slides',
            description: '4 học sinh cùng mở 1 liên kết bài thuyết trình, mỗi người phụ trách một nhóm slide, bình luận góp ý và thấy con trỏ của nhau theo thời gian thực.',
          },
        ],
        quickCheckQuestionIds: ['q-201', 'q-202'],
      },
    ],
  },
  {
    id: 'topic-3',
    code: 'CD3',
    title: 'Soạn thảo văn bản, bảng tính và trình chiếu nâng cao',
    description: 'Hàm thống kê, hàm tìm kiếm (VLOOKUP, INDEX, MATCH, SUMIFS), định dạng có điều kiện, trình bày chuyên nghiệp.',
    iconName: 'FileSpreadsheet',
    badge: 'Trọng tâm thi cử',
    objectives: [
      'Thành thạo các hàm xử lý dữ liệu: IF, AND, OR, SUMIFS, COUNTIFS, AVERAGEIFS.',
      'Sử dụng các hàm tìm kiếm và tham chiếu: VLOOKUP, HLOOKUP, INDEX, MATCH.',
      'Áp dụng định dạng có điều kiện (Conditional Formatting) để trực quan hóa dữ liệu.',
      'Thiết kế bài trình chiếu chuyên nghiệp, chuẩn mực sư phạm, tránh quá tải thị giác.',
    ],
    lessons: [
      {
        id: 'lesson-3-1',
        topicId: 'topic-3',
        title: 'Bài 1: Các hàm logic và thống kê có điều kiện trong Excel',
        order: 1,
        summary: 'Cú pháp và ứng dụng của hàm IF lồng, hàm SUMIF, SUMIFS, COUNTIF, COUNTIFS.',
        fullTheory: `### 1. Hàm điều kiện IF
- Cú pháp: \`=IF(logical_test, value_if_true, [value_if_false])\`
- Hàm IF lồng nhau cho phép đánh giá nhiều mức điều kiện (ví dụ: xếp loại học sinh Giỏi, Khá, Trung bình).

### 2. Hàm đếm có điều kiện:
- **COUNTIF:** \`=COUNTIF(range, criteria)\` – Đếm số ô thỏa mãn 1 điều kiện.
- **COUNTIFS:** \`=COUNTIFS(criteria_range1, criteria1, [criteria_range2, criteria2], ...)\` – Đếm số ô thỏa mãn đồng thời nhiều điều kiện.

### 3. Hàm tính tổng có điều kiện:
- **SUMIF:** \`=SUMIF(range, criteria, [sum_range])\`
- **SUMIFS:** \`=SUMIFS(sum_range, criteria_range1, criteria1, criteria_range2, criteria2, ...)\`
  *Lưu ý quan trọng:* Trong SUMIFS, vùng tính tổng \`sum_range\` đặt ở **đầu tiên**, khác với SUMIF đặt ở cuối cùng!`,
        keyTakeaways: [
          'Trong SUMIF: vùng tính tổng đặt ở cuối cùng.',
          'Trong SUMIFS: vùng tính tổng (sum_range) đặt ở vị trí tham số ĐẦU TIÊN.',
          'Điều kiện dạng chuỗi hoặc toán tử so sánh phải đặt trong dấu ngoặc kép (ví dụ: ">=8.0").',
        ],
        commonPitfalls: [
          'Đảo lộn vị trí vùng tính tổng giữa hàm SUMIF và SUMIFS gây lỗi #VALUE! hoặc kết quả sai.',
          'Quên đặt dấu ngoặc kép cho điều kiện so sánh như ">50".',
        ],
        examples: [
          {
            title: 'Tính tổng điểm xét tuyển học sinh khối A',
            description: '=SUMIFS(E2:E100, B2:B100, "Khối A", C2:C100, ">=24") sẽ tính tổng cột điểm E cho các học sinh thuộc khối A và có tổng điểm >= 24.',
          },
        ],
        quickCheckQuestionIds: ['q-301', 'q-302'],
      },
      {
        id: 'lesson-3-2',
        topicId: 'topic-3',
        title: 'Bài 2: Hàm tìm kiếm và tham chiếu dữ liệu (VLOOKUP, INDEX, MATCH)',
        order: 2,
        summary: 'Nguyên lý tra cứu dọc với VLOOKUP, kết hợp INDEX và MATCH để tra cứu linh hoạt.',
        fullTheory: `### 1. Hàm VLOOKUP (Vertical Lookup)
- Cú pháp: \`=VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])\`
  - \`lookup_value\`: Giá trị cần tìm kiếm.
  - \`table_array\`: Bảng dữ liệu chứa giá trị tìm kiếm (Cột tìm kiếm PHẢI là cột đầu tiên bên trái).
  - \`col_index_num\`: Số thứ tự của cột lấy kết quả (tính từ 1).
  - \`range_lookup\`: 0 (FALSE) để tìm kiếm chính xác tuyệt đối; 1 (TRUE) để tìm kiếm xấp xỉ.

### 2. Cặp hàm INDEX và MATCH
- **INDEX:** \`=INDEX(array, row_num, [column_num])\` – Trả về giá trị tại vị trí dòng và cột xác định.
- **MATCH:** \`=MATCH(lookup_value, lookup_array, [match_type])\` – Trả về vị trí tương đối của giá trị trong mảng.
- **Kết hợp:** \`=INDEX(Cột_Kết_Quả, MATCH(Giá_Trị_Tìm, Cột_Tra_Cứu, 0))\`
  *Ưu điểm:* Có thể tra cứu giá trị nằm ở bên trái cột tìm kiếm, không bị giới hạn như VLOOKUP.`,
        keyTakeaways: [
          'Tham số thứ tư của VLOOKUP là 0 (hoặc FALSE) khi cần tìm kiếm chính xác tuyệt đối (mã học sinh, mã hàng).',
          'VLOOKUP chỉ tìm được từ trái sang phải; cột tra cứu bắt buộc là cột 1 của table_array.',
          'INDEX kết hợp MATCH khắc phục hoàn toàn nhược điểm tìm kiếm ngược chiều của VLOOKUP.',
        ],
        commonPitfalls: [
          'Quên cố định địa chỉ bảng ($A$2:$D$20) khi sao chép công thức VLOOKUP xuống các hàng dưới.',
          'Bỏ quên tham số 0 (chính xác) khiến VLOOKUP trả về giá trị xấp xỉ sai lệch.',
        ],
        examples: [
          {
            title: 'Tra cứu xếp loại tốt nghiệp từ Mã thí sinh',
            description: '=VLOOKUP(A5, $H$2:$K$50, 4, 0) tìm mã thí sinh tại ô A5 trong bảng dữ liệu H2:K50 và lấy kết quả cột 4.',
          },
        ],
        quickCheckQuestionIds: ['q-303', 'q-304'],
      },
    ],
  },
  {
    id: 'topic-4',
    code: 'CD4',
    title: 'Khai thác Internet, tìm kiếm, đánh giá và xử lý thông tin',
    description: 'Toán tử tìm kiếm nâng cao, kiểm chứng độ tin cậy thông tin số, bản quyền số và trích dẫn chuẩn.',
    iconName: 'Search',
    badge: 'Kỹ năng số',
    objectives: [
      'Sử dụng các toán tử tìm kiếm nâng cao (site:, filetype:, dấu ngoặc kép, dấu trừ).',
      'Đánh giá tính tin cậy của thông tin trên Internet qua tiêu chuẩn tác giả, ngày phát hành, mục đích.',
      'Hiểu và tôn trọng bản quyền sở hữu trí tuệ số, giấy phép Creative Commons.',
      'Tránh hiện tượng bẫy thông tin giả (Fake News) và thiên kiến xác nhận.',
    ],
    lessons: [
      {
        id: 'lesson-4-1',
        topicId: 'topic-4',
        title: 'Bài 1: Kỹ thuật tìm kiếm và Đánh giá thông tin trên Internet',
        order: 1,
        summary: 'Sử dụng toán tử Google Search và phương pháp kiểm chứng thông tin.',
        fullTheory: `### 1. Các toán tử tìm kiếm nâng cao trên Google:
- **"cụm từ chính xác":** Tìm kiếm đúng thứ tự từ trong dấu ngoặc kép.
- **site:tên_miền:** Chỉ tìm kiếm thông tin trên một website hoặc tên miền cụ thể (ví dụ: \`site:moet.gov.vn\`).
- **filetype:phần_mở_rộng:** Giới hạn kết quả theo định dạng tệp (ví dụ: \`filetype:pdf\`, \`filetype:pptx\`).
- **dấu trừ (-):** Loại trừ kết quả chứa từ khóa phía sau (ví dụ: \`tin học 12 -game\`).
- **OR (viết hoa):** Tìm một trong các từ khóa.
- **related:website:** Tìm các trang web có nội dung tương tự.

### 2. Tiêu chí kiểm chứng độ tin cậy của thông tin (Phương pháp CRAAP):
- **Tính thời sự (Currency):** Thời điểm đăng tải và cập nhật nội dung.
- **Độ liên quan (Relevance):** Thông tin có giải quyết đúng vấn đề cần nghiên cứu hay không.
- **Thẩm quyền tác giả (Authority):** Tác giả, tổ chức phát hành có chuyên môn và uy tín không (tên miền .gov, .edu).
- **Tính chính xác (Accuracy):** Có số liệu, bằng chứng, nguồn kiểm chứng độc lập không.
- **Mục đích (Purpose):** Bài viết nhằm mục đích giáo dục, khoa học hay quảng cáo, kích động, thương mại?`,
        keyTakeaways: [
          'Toán tử filetype:pdf giúp tải trực tiếp tài liệu học tập chuẩn.',
          'Toán tử site: giúp lọc thông tin từ cơ quan chính phủ (.gov.vn) hoặc cơ sở giáo dục (.edu.vn).',
          'Luôn đối chiếu chéo thông tin từ ít nhất hai nguồn tin cậy trước khi sử dụng làm luận cứ.',
        ],
        commonPitfalls: [
          'Tin tưởng hoàn toàn vào kết quả đầu tiên trên công cụ tìm kiếm mà không để ý nhãn quảng cáo (Sponsored).',
          'Chia sẻ tin tức từ mạng xã hội mà không kiểm tra thẩm quyền của nguồn phát hành.',
        ],
        examples: [
          {
            title: 'Tìm đề cương ôn thi Tin học tốt nghiệp dạng PDF của Bộ GD&ĐT',
            description: 'Nhập vào ô tìm kiếm: "đề thi tham khảo tốt nghiệp thpt tin học" site:moet.gov.vn filetype:pdf',
          },
        ],
        quickCheckQuestionIds: ['q-401', 'q-402'],
      },
    ],
  },
  {
    id: 'topic-5',
    code: 'CD5',
    title: 'Thiết kế và xây dựng trang web',
    description: 'Cấu trúc tài liệu HTML5, định kiểu giao diện bằng CSS, hệ quản trị nội dung CMS và xuất bản web.',
    iconName: 'Globe',
    badge: 'Ứng dụng Web',
    objectives: [
      'Hiểu cấu trúc cơ bản của trang web và ngôn ngữ đánh dấu HTML5.',
      'Sử dụng các thẻ HTML thông dụng: tiêu đề, đoạn văn, danh sách, bảng, liên kết và hình ảnh.',
      'Sử dụng CSS để định kiểu màu sắc, phông chữ, khoảng cách và bố cục cơ bản.',
      'Hiểu nguyên lý hoạt động của hệ quản trị nội dung (CMS) và quy trình xuất bản website.',
    ],
    lessons: [
      {
        id: 'lesson-5-1',
        topicId: 'topic-5',
        title: 'Bài 1: Cấu trúc trang web với HTML5 và định kiểu CSS',
        order: 1,
        summary: 'Các thẻ HTML cơ bản, thẻ ngữ nghĩa semantic và cú pháp bộ chọn CSS.',
        fullTheory: `### 1. Cấu trúc tài liệu HTML5
\`\`\`html
<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8">
    <title>Tiêu đề trang</title>
  </head>
  <body>
    <!-- Nội dung hiển thị với người xem -->
  </body>
</html>
\`\`\`

### 2. Các thẻ HTML quan trọng:
- Thẻ tiêu đề: \`<h1>\` đến \`<h6>\` (h1 là tiêu đề quan trọng nhất).
- Thẻ văn bản và định dạng: \`<p>\` (đoạn văn), \`<strong>\` (in đậm ngữ nghĩa), \`<em>\` (in nghiêng), \`<br>\` (ngắt dòng).
- Thẻ liên kết và hình ảnh: \`<a href="url">\` (siêu liên kết), \`<img src="link" alt="mô tả">\` (hình ảnh).
- Thẻ danh sách: \`<ul>\` (không thứ tự), \`<ol>\` (có thứ tự), \`<li>\` (phần tử danh sách).
- Thẻ ngữ nghĩa HTML5: \`<header>\`, \`<nav>\`, \`<main>\`, \`<article>\`, \`<section>\`, \`<footer>\`.

### 3. CSS (Cascading Style Sheets):
- Cú pháp: \`selector { property: value; }\`
- 3 cách chèn CSS: Inline (trong thuộc tính style), Internal (trong thẻ <style>), External (file .css riêng qua thẻ <link>).
- Mô hình hộp (Box Model): Content -> Padding -> Border -> Margin.`,
        keyTakeaways: [
          'HTML đóng vai trò xây dựng cấu trúc bộ khung, CSS đóng vai trò trang trí diện mạo giao diện.',
          'Thuộc tính alt trong thẻ img là bắt buộc để hỗ trợ người khiếm thị và hiển thị khi ảnh lỗi.',
          'Margin là khoảng cách bên ngoài đường viền (Border), Padding là khoảng cách bên trong giữa nội dung và viền.',
        ],
        commonPitfalls: [
          'Quên đóng các thẻ cặp (như </div>, </p>, </a>) gây vỡ giao diện.',
          'Nhầm lẫn giữa Margin (khoảng cách ngoài) và Padding (khoảng cách trong).',
        ],
        examples: [
          {
            title: 'Tạo nút bấm kêu gọi hành động với HTML và CSS',
            description: '<a href="#on-tap" class="btn-primary">Bắt đầu học ngay</a> được định kiểu nền xanh chữ trắng bo tròn góc.',
          },
        ],
        quickCheckQuestionIds: ['q-501', 'q-502'],
      },
    ],
  },
  {
    id: 'topic-6',
    code: 'CD6',
    title: 'Ứng dụng phần mềm, dữ liệu và công cụ số giải quyết vấn đề',
    description: 'Thu thập, làm sạch, phân tích dữ liệu số, chọn biểu đồ trực quan hóa phù hợp bài toán thực tế.',
    iconName: 'BarChart3',
    badge: 'Xử lý dữ liệu',
    objectives: [
      'Hiểu quy trình xử lý dữ liệu số: Thu thập -> Tiền xử lý -> Phân tích -> Trực quan hóa -> Ra quyết định.',
      'Lựa chọn biểu đồ phù hợp: Biểu đồ cột (so sánh), biểu đồ đường (xu hướng), biểu đồ tròn (cơ cấu tỷ lệ).',
      'Ứng dụng bảng tổng hợp Pivot Table để tóm tắt dữ liệu lớn.',
      'Sử dụng phần mềm mô phỏng và công cụ số để tối ưu hóa giải pháp.',
    ],
    lessons: [
      {
        id: 'lesson-6-1',
        topicId: 'topic-6',
        title: 'Bài 1: Phân tích và Trực quan hóa dữ liệu số',
        order: 1,
        summary: 'Các nguyên tắc chọn dạng biểu đồ và kỹ thuật tóm tắt dữ liệu phục vụ báo cáo.',
        fullTheory: `### 1. Quy trình giải quyết bài toán bằng dữ liệu số:
1. Xác định mục tiêu và câu hỏi cần giải quyết.
2. Thu thập dữ liệu từ các nguồn khảo sát, đo lường, phần mềm quản lý.
3. Làm sạch dữ liệu: Xóa dòng trùng lặp, xử lý giá trị khuyết thiếu (null), chuẩn hóa định dạng ngày tháng/số.
4. Phân tích: Sử dụng các hàm thống kê, Pivot Table để phát hiện quy luật.
5. Trực quan hóa và trình bày kết quả.

### 2. Quy tắc lựa chọn loại biểu đồ trực quan:
- **Biểu đồ cột (Column / Bar Chart):** So sánh giá trị giữa các danh mục độc lập (ví dụ: doanh số theo tỉnh thành, điểm trung bình theo môn).
- **Biểu đồ đường (Line Chart):** Thể hiện xu hướng biến thiên liên tục theo thời gian (ví dụ: nhiệt độ các tháng trong năm, chỉ số tăng trưởng).
- **Biểu đồ tròn (Pie Chart):** Thể hiện cơ cấu tỷ lệ phần trăm của một tổng thể (tổng phải bằng 100%, chỉ nên dùng khi có dưới 6-7 thành phần).
- **Biểu đồ phân tán (Scatter Plot):** Khảo sát mối tương quan giữa 2 biến số định lượng.`,
        keyTakeaways: [
          'Biểu đồ tròn chỉ dùng khi các thành phần cộng lại đúng bằng 100% của một tổng thể nguyên vẹn.',
          'Biểu đồ đường là lựa chọn tối ưu nhất khi trục hoành là yếu tố thời gian liên tục.',
          'Pivot Table cho phép xoay chiều và nhóm dữ liệu mà không làm thay đổi bảng dữ liệu gốc.',
        ],
        commonPitfalls: [
          'Dùng biểu đồ tròn khi tổng các giá trị không đại diện cho 100% hoặc có quá nhiều lát cắt nhỏ li ti.',
          'Không ghi rõ đơn vị đo trên các trục tọa độ của biểu đồ.',
        ],
        examples: [
          {
            title: 'Phân tích phổ điểm thi tốt nghiệp',
            description: 'Dùng biểu đồ cột để biểu diễn số lượng thí sinh đạt từng mức điểm (từ 0 đến 10), giúp nhận diện độ lệch chuẩn và mức độ phân hóa của đề thi.',
          },
        ],
        quickCheckQuestionIds: ['q-601', 'q-602'],
      },
    ],
  },
  {
    id: 'topic-7',
    code: 'CD7',
    title: 'An toàn thông tin, bảo vệ dữ liệu cá nhân và văn hóa số',
    description: 'Xác thực đa yếu tố (2FA), mã độc (Malware, Ransomware), tấn công Phishing, Luật An ninh mạng và ứng xử văn minh số.',
    iconName: 'ShieldCheck',
    badge: 'An toàn & Pháp luật',
    objectives: [
      'Nhận biết các hình thức tấn công lừa đảo phổ biến: Phishing, Social Engineering, Giả mạo danh tính.',
      'Thiết lập các biện pháp phòng vệ: Mật khẩu mạnh, xác thực 2 bước (2FA/MFA), sao lưu ngoại tuyến.',
      'Hiểu các quy định cơ bản của Luật An ninh mạng Việt Nam và Nghị định về bảo vệ dữ liệu cá nhân.',
      'Thực hành văn hóa ứng xử trên không gian mạng: Tôn trọng người khác, chống bắt nạt qua mạng (Cyberbullying).',
    ],
    lessons: [
      {
        id: 'lesson-7-1',
        topicId: 'topic-7',
        title: 'Bài 1: An toàn dữ liệu cá nhân và Phòng chống lừa đảo số',
        order: 1,
        summary: 'Các mối đe dọa an toàn thông tin, tấn công kỹ thuật xã hội và các biện pháp bảo vệ tài khoản số.',
        fullTheory: `### 1. Các mối đe dọa an toàn thông tin:
- **Phishing (Tấn công giả mạo):** Kẻ xấu gửi email, tin nhắn mạo danh ngân hàng, giáo viên, nhà trường chứa đường link giả mạo để chiếm đoạt tài khoản.
- **Ransomware (Mã độc tống tiền):** Mã độc xâm nhập và mã hóa toàn bộ dữ liệu máy tính, yêu cầu nạn nhân trả tiền chuộc để lấy khóa giải mã.
- **Spyware (Phần mềm gián điệp):** Âm thầm ghi lại thao tác bàn phím (Keylogger), chụp màn hình để đánh cắp thông tin đăng nhập.

### 2. Các nguyên tắc bảo vệ tài khoản:
- **Mật khẩu an toàn:** Dài tối thiểu 12 ký tự, phối hợp chữ hoa, chữ thường, chữ số và ký tự đặc biệt, không dùng thông tin cá nhân dễ đoán.
- **Xác thực 2 yếu tố (2FA / Two-Factor Authentication):** Yêu cầu thêm mã OTP gửi về điện thoại hoặc ứng dụng Authenticator bên cạnh mật khẩu.
- **Quy tắc sao lưu 3-2-1:** Lưu 3 bản sao dữ liệu, trên 2 phương tiện lưu trữ khác nhau, trong đó có 1 bản lưu tại địa điểm khác (đám mây hoặc ổ cứng ngoài).

### 3. Pháp luật và Văn hóa trên không gian mạng:
- Luật An ninh mạng nghiêm cấm phát tán thông tin sai sự thật, xúc phạm danh dự nhân phẩm, xuyên tạc chủ quyền quốc gia.
- Nghị định số 13/2023/NĐ-CP về Bảo vệ dữ liệu cá nhân: Dữ liệu cá nhân (họ tên, CCCD, số điện thoại, vị trí) phải được bảo mật và chỉ được thu thập khi có sự đồng ý.`,
        keyTakeaways: [
          '2FA là lá chắn quan trọng nhất: ngay cả khi lộ mật khẩu, kẻ gian vẫn không thể đăng nhập nếu không có yếu tố xác thực thứ hai.',
          'Không bao giờ cung cấp mã OTP cho bất kỳ ai, kể cả người tự xưng là nhân viên ngân hàng hay hỗ trợ kỹ thuật.',
          'Mọi hành vi trên không gian mạng đều để lại dấu vết số (Digital Footprint) và chịu chế tài pháp lý.',
        ],
        commonPitfalls: [
          'Dùng chung một mật khẩu cho tất cả tài khoản mạng xã hội, email và ngân hàng.',
          'Bấm vào đường link lạ trong tin nhắn trúng thưởng mà không kiểm tra tên miền gốc.',
        ],
        examples: [
          {
            title: 'Nhận diện email lừa đảo mạo danh',
            description: 'Kiểm tra kỹ địa chỉ email người gửi (ví dụ: support@faceb00k-security.com thay vì @facebook.com), xem lời đe dọa khóa tài khoản khẩn cấp là dấu hiệu điển hình của Phishing.',
          },
        ],
        quickCheckQuestionIds: ['q-701', 'q-702'],
      },
    ],
  },
];

export const INITIAL_QUESTIONS: Question[] = [
  // --- CHUYÊN ĐỀ 1: SỬ DỤNG MÁY TÍNH & CÔNG CỤ SỐ ---
  {
    id: 'q-101',
    topicId: 'topic-1',
    lessonId: 'lesson-1-1',
    content: 'Thiết bị nào sau đây đóng vai trò kết nối các thiết bị trong cùng một mạng cục bộ (LAN) và chuyển tiếp các gói tin dựa trên địa chỉ MAC?',
    type: 'multiple_choice',
    difficulty: 'Nhận biết',
    options: [
      { id: 'A', text: 'Router' },
      { id: 'B', text: 'Switch' },
      { id: 'C', text: 'Modem' },
      { id: 'D', text: 'Repeater' },
    ],
    correctAnswer: 'B',
    explanation: 'Switch (bộ chuyển mạch) hoạt động ở tầng liên kết dữ liệu (Data Link) của mô hình mạng, sử dụng bảng địa chỉ MAC để chuyển tiếp khung dữ liệu chính xác đến cổng của thiết bị nhận trong cùng mạng LAN. Router chuyển tiếp theo IP, còn Modem dùng điều chế tín hiệu.',
    keyTakeaway: 'Switch chuyển tiếp dựa trên địa chỉ MAC trong mạng nội bộ.',
    reference: 'SGK Tin học 12 – Chuyên đề Mạng máy tính',
    isVerified: true,
    source: 'Ngân hàng chuẩn Tin học 12',
  },
  {
    id: 'q-102',
    topicId: 'topic-1',
    lessonId: 'lesson-1-1',
    content: 'Khi một ứng dụng trên máy tính bị treo (Not Responding) và không thể đóng bằng cách nhấn vào nút X, giải pháp tối ưu và an toàn nhất là gì?',
    type: 'multiple_choice',
    difficulty: 'Thông hiểu',
    options: [
      { id: 'A', text: 'Rút ngay phích cắm nguồn điện của máy tính để tắt đột ngột' },
      { id: 'B', text: 'Bấm giữ nút nguồn (Power) 10 giây cho máy tắt hẳn' },
      { id: 'C', text: 'Mở Task Manager (Ctrl + Shift + Esc), tìm ứng dụng và chọn End Task' },
      { id: 'D', text: 'Cài đặt lại toàn bộ hệ điều hành Windows' },
    ],
    correctAnswer: 'C',
    explanation: 'Sử dụng Task Manager cho phép người dùng can thiệp trực tiếp vào tiến trình (process) đang bị treo, gửi tín hiệu hủy tiến trình mà không làm mất dữ liệu của các phần mềm khác đang chạy ngầm và không gây hại ổ cứng như việc ngắt nguồn đột ngột.',
    keyTakeaway: 'Ctrl + Shift + Esc là phím tắt nhanh nhất để mở Task Manager xử lý phần mềm treo.',
    reference: 'SGK Tin học 12 – Sử dụng hệ điều hành',
    isVerified: true,
    source: 'Đề kiểm tra định kỳ Tin học 12',
  },
  {
    id: 'q-103',
    topicId: 'topic-1',
    lessonId: 'lesson-1-2',
    content: 'Cho các nhận định sau đây về địa chỉ IP và cấu hình mạng máy tính trong phòng thực hành Tin học:',
    type: 'true_false',
    difficulty: 'Thông hiểu',
    subQuestions: [
      { id: 'a', text: 'Địa chỉ IPv4 gồm 32 bit được chia làm 4 nhóm số thập phân cách nhau bởi dấu chấm.', correct: true },
      { id: 'b', text: 'Địa chỉ IP riêng (Private IP) như 192.168.1.5 có thể được định tuyến công khai trực tiếp trên toàn cầu Internet.', correct: false },
      { id: 'c', text: 'Giao thức DHCP có nhiệm vụ tự động cấp phát địa chỉ IP cho các máy trạm khi kết nối vào mạng.', correct: true },
      { id: 'd', text: 'Hai máy tính trong cùng một mạng LAN có thể đặt trùng một địa chỉ IP mà vẫn truy cập mạng bình thường.', correct: false },
    ],
    correctAnswer: [true, false, true, false],
    explanation: 'Ý a đúng: Cấu trúc IPv4 gồm 32 bit (4 byte). Ý b sai: Private IP chỉ có giá trị nội bộ, muốn ra Internet phải qua cơ chế NAT của Router. Ý c đúng: DHCP (Dynamic Host Configuration Protocol) cấp IP động. Ý d sai: Trùng IP sẽ dẫn đến xung đột (IP Conflict) làm cả hai máy mất kết nối.',
    keyTakeaway: 'Trong cùng mạng LAN, mỗi thiết bị bắt buộc phải có một địa chỉ IP duy nhất.',
    reference: 'SGK Tin học 12 – Chuyên đề Mạng và kết nối',
    isVerified: true,
    source: 'Cấu trúc đề tham khảo thi tốt nghiệp THPT',
  },
  {
    id: 'q-104',
    topicId: 'topic-1',
    lessonId: 'lesson-1-2',
    content: 'Địa chỉ IPv4 tiêu chuẩn bao gồm bao nhiêu bit nhị phân?',
    type: 'short_answer',
    difficulty: 'Nhận biết',
    correctAnswer: '32',
    explanation: 'Địa chỉ IPv4 có độ dài chính xác là 32 bit, chia thành 4 octet (mỗi octet 8 bit). Trong khi đó, địa chỉ IPv6 có độ dài 128 bit.',
    keyTakeaway: 'IPv4 = 32 bit; IPv6 = 128 bit.',
    reference: 'SGK Tin học 12 – Mạng máy tính',
    isVerified: true,
    source: 'Bộ câu hỏi trắc nghiệm Tin học 12',
  },

  // --- CHUYÊN ĐỀ 2: ỨNG DỤNG CNTT TRONG HỌC TẬP VÀ ĐỜI SỐNG ---
  {
    id: 'q-201',
    topicId: 'topic-2',
    lessonId: 'lesson-2-1',
    content: 'Mô hình dịch vụ điện toán đám mây nào cho phép người dùng cuối sử dụng trực tiếp các ứng dụng văn phòng (như Google Docs, Microsoft 365 trực tuyến) qua trình duyệt mà không cần cài đặt phần mềm trên máy tính?',
    type: 'multiple_choice',
    difficulty: 'Nhận biết',
    options: [
      { id: 'A', text: 'IaaS (Hạ tầng như một dịch vụ)' },
      { id: 'B', text: 'PaaS (Nền tảng như một dịch vụ)' },
      { id: 'C', text: 'SaaS (Phần mềm như một dịch vụ)' },
      { id: 'D', text: 'DaaS (Dữ liệu như một dịch vụ)' },
    ],
    correctAnswer: 'C',
    explanation: 'SaaS (Software as a Service) cung cấp ứng dụng hoàn chỉnh cho người dùng cuối qua mạng Internet. Ví dụ điển hình là Gmail, Google Docs, Office 365 online.',
    keyTakeaway: 'SaaS = Software as a Service: dịch vụ phần mềm trực tuyến cho người dùng cuối.',
    reference: 'SGK Tin học 12 – Điện toán đám mây',
    isVerified: true,
    source: 'Ngân hàng câu hỏi Tin học ứng dụng',
  },
  {
    id: 'q-202',
    topicId: 'topic-2',
    lessonId: 'lesson-2-1',
    content: 'Khi chia sẻ tệp tài liệu ôn tập trên Google Drive cho bạn học, nếu muốn bạn chỉ được phép đọc và để lại nhận xét góp ý mà KHÔNG thể xóa hoặc sửa đổi trực tiếp nội dung văn bản, ta nên cấp quyền nào?',
    type: 'multiple_choice',
    difficulty: 'Thông hiểu',
    options: [
      { id: 'A', text: 'Viewer (Người xem)' },
      { id: 'B', text: 'Commenter (Người nhận xét)' },
      { id: 'C', text: 'Editor (Người chỉnh sửa)' },
      { id: 'D', text: 'Owner (Chủ sở hữu)' },
    ],
    correctAnswer: 'B',
    explanation: 'Quyền Commenter (Người nhận xét) cho phép người được chia sẻ xem tài liệu và tạo các ghi chú nhận xét, đề xuất sửa đổi nhưng không thể trực tiếp ghi đè hay xóa nội dung gốc.',
    keyTakeaway: '3 cấp độ phân quyền cơ bản: Viewer (Xem) -> Commenter (Nhận xét) -> Editor (Chỉnh sửa).',
    reference: 'SGK Tin học 12 – Lưu trữ và cộng tác số',
    isVerified: true,
    source: 'Đề ôn tập Tin học 12 học kỳ II',
  },

  // --- CHUYÊN ĐỀ 3: SOẠN THẢO, BẢNG TÍNH & TRÌNH CHIẾU ---
  {
    id: 'q-301',
    topicId: 'topic-3',
    lessonId: 'lesson-3-1',
    content: 'Trong Microsoft Excel, tại ô D5 có công thức: `=SUMIFS(C2:C10, A2:A10, "Nam", B2:B10, ">=8.0")`. Vùng dữ liệu nào đóng vai trò là vùng tính tổng các giá trị thỏa mãn điều kiện?',
    type: 'multiple_choice',
    difficulty: 'Thông hiểu',
    options: [
      { id: 'A', text: 'A2:A10' },
      { id: 'B', text: 'B2:B10' },
      { id: 'C', text: 'C2:C10' },
      { id: 'D', text: 'D5' },
    ],
    correctAnswer: 'C',
    explanation: 'Trong hàm SUMIFS, cú pháp chuẩn là =SUMIFS(sum_range, criteria_range1, criteria1, criteria_range2, criteria2,...). Như vậy tham số đầu tiên C2:C10 chính là vùng tính tổng.',
    keyTakeaway: 'Hàm SUMIFS đặt vùng tính tổng ở vị trí đầu tiên, khác với SUMIF đặt ở cuối.',
    reference: 'SGK Tin học 12 – Các hàm tính toán nâng cao',
    isVerified: true,
    source: 'Đề thi chọn học sinh giỏi & thi tốt nghiệp',
  },
  {
    id: 'q-302',
    topicId: 'topic-3',
    lessonId: 'lesson-3-1',
    content: 'Xét bảng tính điểm thi tốt nghiệp của lớp 12A. Hãy đánh giá tính Đúng / Sai của các nhận định sau về các hàm tính toán trong Excel:',
    type: 'true_false',
    difficulty: 'Vận dụng',
    subQuestions: [
      { id: 'a', text: 'Hàm =COUNTIF(E2:E45, ">=5") đếm số học sinh có điểm tại cột E từ 5 điểm trở lên.', correct: true },
      { id: 'b', text: 'Hàm SUMIF có thể đánh giá đồng thời từ 3 điều kiện ở các cột khác nhau trở lên.', correct: false },
      { id: 'c', text: 'Điều kiện so sánh dạng số trong hàm COUNTIF như ">=5" bắt buộc phải được đặt trong cặp dấu ngoặc kép.', correct: true },
      { id: 'd', text: 'Khi tính trung bình có điều kiện, hàm AVERAGEIFS sẽ tự động bỏ qua các ô rỗng trong vùng tính giá trị trung bình.', correct: true },
    ],
    correctAnswer: [true, false, true, false],
    explanation: 'Ý a đúng vì COUNTIF đếm theo 1 điều kiện. Ý b sai vì SUMIF chỉ đánh giá được duy nhất 1 điều kiện (muốn nhiều điều kiện phải dùng SUMIFS). Ý c đúng theo quy định cú pháp của Excel. Ý d đúng vì các hàm thống kê điều kiện tự động bỏ qua ô rỗng.',
    keyTakeaway: 'SUMIF dùng cho 1 điều kiện; SUMIFS dùng cho 1 hoặc nhiều điều kiện đồng thời.',
    reference: 'SGK Tin học 12 – Xử lý bảng tính',
    isVerified: true,
    source: 'Ma trận câu hỏi thi tốt nghiệp THPT',
  },
  {
    id: 'q-303',
    topicId: 'topic-3',
    lessonId: 'lesson-3-2',
    content: 'Trong hàm `=VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])`, tham số `range_lookup` cần nhận giá trị nào để thực hiện tìm kiếm chính xác tuyệt đối?',
    type: 'multiple_choice',
    difficulty: 'Nhận biết',
    options: [
      { id: 'A', text: '1 hoặc TRUE' },
      { id: 'B', text: '0 hoặc FALSE' },
      { id: 'C', text: '2' },
      { id: 'D', text: '-1' },
    ],
    correctAnswer: 'B',
    explanation: 'Tham số range_lookup bằng 0 (hoặc FALSE) quy định tìm kiếm chính xác tuyệt đối. Nếu không tìm thấy sẽ trả về lỗi #N/A. Nếu là 1 (hoặc TRUE) sẽ tìm kiếm xấp xỉ (yêu cầu cột tra cứu phải sắp xếp tăng dần).',
    keyTakeaway: 'VLOOKUP tham số cuối là 0 (FALSE) khi tra cứu chính xác mã hồ sơ, mã sản phẩm.',
    reference: 'SGK Tin học 12 – Hàm tra cứu VLOOKUP',
    isVerified: true,
    source: 'Bộ đề ôn tập tốt nghiệp THPT Tin học',
  },
  {
    id: 'q-304',
    topicId: 'topic-3',
    lessonId: 'lesson-3-2',
    content: 'Tên hàm Excel nào dùng để trả về vị trí tương đối (số thứ tự hàng hoặc cột) của một giá trị trong một mảng tra cứu (thường kết hợp với hàm INDEX)?',
    type: 'short_answer',
    difficulty: 'Thông hiểu',
    correctAnswer: 'MATCH',
    explanation: 'Hàm MATCH(lookup_value, lookup_array, [match_type]) tìm kiếm một giá trị trong một dãy ô và trả về vị trí tương đối của giá trị đó trong dãy.',
    keyTakeaway: 'MATCH trả về vị trí số; INDEX trả về giá trị tại vị trí đó.',
    reference: 'SGK Tin học 12 – Tra cứu nâng cao',
    isVerified: true,
    source: 'Tài liệu hướng dẫn thực hành Tin học 12',
  },

  // --- CHUYÊN ĐỀ 4: KHAI THÁC INTERNET, TÌM KIẾM & XỬ LÝ THÔNG TIN ---
  {
    id: 'q-401',
    topicId: 'topic-4',
    lessonId: 'lesson-4-1',
    content: 'Học sinh muốn tìm kiếm tài liệu ôn thi môn Tin học ở định dạng file PDF được phát hành trực tiếp trên Cổng thông tin của Bộ Giáo dục và Đào tạo (tên miền moet.gov.vn). Cú pháp tìm kiếm nào trên Google là tối ưu nhất?',
    type: 'multiple_choice',
    difficulty: 'Vận dụng',
    options: [
      { id: 'A', text: 'tin hoc 12 pdf download moet.gov.vn' },
      { id: 'B', text: '"on thi tin hoc 12" site:moet.gov.vn filetype:pdf' },
      { id: 'C', text: 'filetype:doc site:google.com "tin hoc 12"' },
      { id: 'D', text: 'link:moet.gov.vn on thi tin hoc' },
    ],
    correctAnswer: 'B',
    explanation: 'Toán tử site:moet.gov.vn giới hạn kết quả chỉ trong website chính thức của Bộ GD&ĐT, toán tử filetype:pdf chỉ lấy các tệp PDF tài liệu, và dấu ngoặc kép tìm kiếm chính xác cụm từ.',
    keyTakeaway: 'Kết hợp site: và filetype: giúp lọc chính xác tài liệu học tập từ nguồn chính thống.',
    reference: 'SGK Tin học 12 – Kỹ năng tìm kiếm thông tin số',
    isVerified: true,
    source: 'Đề minh họa thi tốt nghiệp THPT',
  },
  {
    id: 'q-402',
    topicId: 'topic-4',
    lessonId: 'lesson-4-1',
    content: 'Đánh giá tính Đúng / Sai của các phương pháp kiểm chứng thông tin trên Internet sau đây:',
    type: 'true_false',
    difficulty: 'Thông hiểu',
    subQuestions: [
      { id: 'a', text: 'Trang web có tên miền kết thúc bằng .gov.vn là trang web thuộc cơ quan nhà nước tại Việt Nam, có độ uy tín cao.', correct: true },
      { id: 'b', text: 'Mọi bài viết có nhiều lượt thích (like) và chia sẻ (share) trên mạng xã hội đều được bảo đảm là sự thật đã kiểm chứng.', correct: false },
      { id: 'c', text: 'Phương pháp kiểm tra chéo (Cross-check) đối chiếu bài viết với nhiều cơ quan báo chí chính thống giúp phát hiện tin giả.', correct: true },
      { id: 'd', text: 'Hình ảnh đăng kèm bài viết không thể bị làm giả hoặc cắt ghép bằng các công cụ trí tuệ nhân tạo (AI).', correct: false },
    ],
    correctAnswer: [true, false, true, false],
    explanation: 'Ý a đúng theo quy định quản lý tên miền quốc gia. Ý b sai vì mạng xã hội dễ bị thao túng bởi bot và thuật toán tương tác. Ý c đúng vì đây là nguyên tắc cốt lõi của đánh giá thông tin. Ý d sai vì AI hiện nay có thể tạo hình ảnh giả mạo (Deepfake) rất tinh vi.',
    keyTakeaway: 'Luôn kiểm chứng nguồn gốc tác giả và đối chiếu chéo trước khi tin tưởng thông tin mạng.',
    reference: 'SGK Tin học 12 – Đánh giá thông tin',
    isVerified: true,
    source: 'Ngân hàng câu hỏi Tin học ứng dụng',
  },

  // --- CHUYÊN ĐỀ 5: THIẾT KẾ VÀ XÂY DỰNG TRANG WEB ---
  {
    id: 'q-501',
    topicId: 'topic-5',
    lessonId: 'lesson-5-1',
    content: 'Trong ngôn ngữ HTML5, thẻ nào sau đây được dùng để định nghĩa một siêu liên kết cho phép người dùng nhấp vào để chuyển đến trang web khác?',
    type: 'multiple_choice',
    difficulty: 'Nhận biết',
    options: [
      { id: 'A', text: '<link>' },
      { id: 'B', text: '<a>' },
      { id: 'C', text: '<href>' },
      { id: 'D', text: '<url>' },
    ],
    correctAnswer: 'B',
    explanation: 'Thẻ <a> (anchor) cùng thuộc tính href được dùng để tạo siêu liên kết (Hyperlink) trong tài liệu HTML. Thẻ <link> dùng trong phần <head> để liên kết file CSS hoặc tài nguyên bên ngoài.',
    keyTakeaway: '<a href="đường_dẫn">Nội dung</a> tạo liên kết chuyển trang.',
    reference: 'SGK Tin học 12 – Thiết kế trang web',
    isVerified: true,
    source: 'Đề kiểm tra Tin học ứng dụng lớp 12',
  },
  {
    id: 'q-502',
    topicId: 'topic-5',
    lessonId: 'lesson-5-1',
    content: 'Trong mô hình hộp (Box Model) của CSS, vùng đệm nằm giữa nội dung phần tử (Content) và đường viền (Border) được gọi là gì?',
    type: 'short_answer',
    difficulty: 'Thông hiểu',
    correctAnswer: 'padding',
    explanation: 'Mô hình hộp CSS gồm 4 lớp từ trong ra ngoài: Content (nội dung) -> Padding (vùng đệm trong) -> Border (đường viền) -> Margin (lề ngoài).',
    keyTakeaway: 'Padding nằm bên trong Border; Margin nằm bên ngoài Border.',
    reference: 'SGK Tin học 12 – Định kiểu giao diện web',
    isVerified: true,
    source: 'Tài liệu bồi dưỡng giáo viên Tin học 12',
  },

  // --- CHUYÊN ĐỀ 6: ỨNG DỤNG PHẦN MỀM & DỮ LIỆU ---
  {
    id: 'q-601',
    topicId: 'topic-6',
    lessonId: 'lesson-6-1',
    content: 'Để biểu diễn sự thay đổi và xu hướng biến thiên của nhiệt độ trung bình các tháng trong năm tại Hà Nội, loại biểu đồ nào sau đây là phù hợp nhất?',
    type: 'multiple_choice',
    difficulty: 'Thông hiểu',
    options: [
      { id: 'A', text: 'Biểu đồ tròn (Pie Chart)' },
      { id: 'B', text: 'Biểu đồ đường (Line Chart)' },
      { id: 'C', text: 'Biểu đồ mạng nhện (Radar Chart)' },
      { id: 'D', text: 'Biểu đồ phân tán (Scatter Chart)' },
    ],
    correctAnswer: 'B',
    explanation: 'Biểu đồ đường (Line Chart) là phương tiện tối ưu nhất để thể hiện xu hướng biến đổi của dữ liệu liên tục theo dòng thời gian (các tháng trong năm). Biểu đồ tròn dùng cho tỷ lệ cơ cấu phần trăm.',
    keyTakeaway: 'Dữ liệu xu hướng theo thời gian -> Ưu tiên chọn Biểu đồ đường (Line Chart).',
    reference: 'SGK Tin học 12 – Biểu diễn dữ liệu',
    isVerified: true,
    source: 'Bộ câu hỏi phát triển năng lực Tin học',
  },
  {
    id: 'q-602',
    topicId: 'topic-6',
    lessonId: 'lesson-6-1',
    content: 'Trong phần mềm bảng tính Excel, công cụ nào cho phép người dùng nhanh chóng tổng hợp, xoay chiều phân tích và nhóm các tập dữ liệu lớn mà không làm thay đổi bảng dữ liệu gốc?',
    type: 'multiple_choice',
    difficulty: 'Thông hiểu',
    options: [
      { id: 'A', text: 'Conditional Formatting' },
      { id: 'B', text: 'PivotTable' },
      { id: 'C', text: 'Data Validation' },
      { id: 'D', text: 'Text to Columns' },
    ],
    correctAnswer: 'B',
    explanation: 'PivotTable là công cụ mạnh mẽ trong Excel dùng để tổng hợp, tính toán tóm tắt (Sum, Count, Average) và phân tích đa chiều dữ liệu một cách trực quan.',
    keyTakeaway: 'PivotTable giúp phân tích và tổng hợp báo cáo đa chiều từ dữ liệu thô.',
    reference: 'SGK Tin học 12 – Xử lý dữ liệu thực tế',
    isVerified: true,
    source: 'Đề kiểm tra học kỳ Tin học 12',
  },

  // --- CHUYÊN ĐỀ 7: AN TOÀN THÔNG TIN & VĂN HÓA SỐ ---
  {
    id: 'q-701',
    topicId: 'topic-7',
    lessonId: 'lesson-7-1',
    content: 'Học sinh nhận được một tin nhắn SMS thông báo: "Tài khoản ngân hàng của bạn bị khóa, vui lòng bấm vào link http://ngan-hang-xyz-capnhat.com để nhập mật khẩu và mã OTP xác minh khẩn cấp". Đây là hình thức tấn công mạng nào?',
    type: 'multiple_choice',
    difficulty: 'Nhận biết',
    options: [
      { id: 'A', text: 'DDoS (Tấn công từ chối dịch vụ phân tán)' },
      { id: 'B', text: 'Phishing (Tấn công lừa đảo giả mạo)' },
      { id: 'C', text: 'Ransomware (Mã độc tống tiền)' },
      { id: 'D', text: 'SQL Injection' },
    ],
    correctAnswer: 'B',
    explanation: 'Phishing (tấn công giả mạo) là phương thức lừa đảo mà kẻ tấn công mạo danh các tổ chức uy tín qua email/tin nhắn/website giả để đánh lừa người dùng cung cấp thông tin nhạy cảm như tài khoản, mật khẩu, mã OTP.',
    keyTakeaway: 'Tuyệt đối không nhấp vào đường link lạ trong tin nhắn yêu cầu cung cấp OTP.',
    reference: 'SGK Tin học 12 – An toàn thông tin số',
    isVerified: true,
    source: 'Cẩm nang an toàn không gian mạng học đường',
  },
  {
    id: 'q-702',
    topicId: 'topic-7',
    lessonId: 'lesson-7-1',
    content: 'Xét các biện pháp bảo vệ dữ liệu cá nhân và an toàn thông tin số sau đây:',
    type: 'true_false',
    difficulty: 'Thông hiểu',
    subQuestions: [
      { id: 'a', text: 'Bật xác thực hai yếu tố (2FA) giúp bảo vệ tài khoản ngay cả khi kẻ gian biết được mật khẩu đăng nhập.', correct: true },
      { id: 'b', text: 'Mã độc tống tiền (Ransomware) chỉ xóa các file rác mà không gây hại đến dữ liệu học tập quan trọng.', correct: false },
      { id: 'c', text: 'Đặt mật khẩu sử dụng chuỗi ngày tháng năm sinh cá nhân là thói quen bảo mật an toàn.', correct: false },
      { id: 'd', text: 'Luật An ninh mạng nghiêm cấm việc phát tán thông tin bịa đặt, xúc phạm danh dự người khác trên mạng xã hội.', correct: true },
    ],
    correctAnswer: [true, false, false, true],
    explanation: 'Ý a đúng vì 2FA yêu cầu thêm yếu tố thứ 2 (mã OTP/khóa sinh trắc học). Ý b sai vì Ransomware mã hóa tống tiền dữ liệu quý giá. Ý c sai vì ngày sinh là thông tin dễ bị dò quét bằng Social Engineering. Ý d đúng theo quy định của Luật An ninh mạng Việt Nam.',
    keyTakeaway: '2FA là biện pháp bảo vệ bắt buộc; không đặt mật khẩu bằng ngày sinh cá nhân.',
    reference: 'SGK Tin học 12 – Pháp luật và đạo đức số',
    isVerified: true,
    source: 'Đề thi tốt nghiệp THPT chính thức định dạng mới',
  },
];

export const INITIAL_EXAMS: ExamConfig[] = [
  {
    id: 'exam-sample-1',
    title: 'Đề thi thử Tốt nghiệp THPT 2025 - 2026 (Đề số 01)',
    description: 'Đề thi chuẩn cấu trúc định dạng mới môn Tin học (định hướng Tin học ứng dụng): Gồm trắc nghiệm 4 lựa chọn, chùm Đúng/Sai 4 ý và trả lời ngắn.',
    durationMinutes: 45,
    questionIds: [
      'q-101', 'q-102', 'q-103', 'q-104',
      'q-201', 'q-202',
      'q-301', 'q-302', 'q-303', 'q-304',
      'q-401', 'q-402',
      'q-501', 'q-502',
      'q-601', 'q-602',
      'q-701', 'q-702',
    ],
    rules: {
      multipleChoiceScore: 0.25,
      trueFalseRule: 'moet', // 1 ý: 0.1đ; 2 ý: 0.25đ; 3 ý: 0.5đ; 4 ý: 1.0đ
      shortAnswerScore: 0.25,
    },
    targetYear: '2025 - 2026',
  },
  {
    id: 'exam-sample-2',
    title: 'Đề kiểm tra nhanh: Bảng tính & Xử lý dữ liệu nâng cao',
    description: 'Chuyên đề trọng tâm phân loại điểm cao: Các hàm điều kiện, tra cứu VLOOKUP, INDEX, MATCH và biểu đồ.',
    durationMinutes: 20,
    questionIds: ['q-301', 'q-302', 'q-303', 'q-304', 'q-601', 'q-602'],
    rules: {
      multipleChoiceScore: 0.5,
      trueFalseRule: 'moet',
      shortAnswerScore: 0.5,
    },
    targetYear: '2025 - 2026',
  },
];
