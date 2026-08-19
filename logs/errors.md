# Error Log — web-novel-auto (The Veridian Protocol)

> รูปแบบตาม `D:\MyHermes\skills\error-log.md` — บันทึกจากเซสชันที่คุณเต้ (ผู้บริหาร SpaceOat)
> เข้ามาแก้บั๊กที่คุณโอ๊ตแจ้งเข้ามาโดยตรง (2026-08-19 ถึง 2026-08-20) เพราะ Hermes แก้เองไม่ตก
> **สรุปภาพรวม + หลักการป้องกันซ้ำ อยู่ที่ `D:\MyHermes\skills\static-site-github-pages-pitfalls.md`
> — อ่านไฟล์นั้นก่อน ไฟล์นี้เป็นรายละเอียดอ้างอิงย้อนหลัง**

---

## Error/Technique: Absolute path (`/...`) พังทั้งเว็บใต้ GitHub Pages subpath
**เกิดขึ้นตอน:** เว็บ deploy อยู่ที่ `https://sritongdeep-eng.github.io/web-novel-auto/` (project site,
ไม่มี custom domain) แต่ทุก `href`/`src` เขียนแบบ `/css/style.css`, `/chapters/xxx.html`
**อาการ:** ปุ่ม Previous/Next → 404, Home ไม่ลิงก์ไปไหน, RSS → 404, ไม่มี CSS โหลดเลย (เว็บดูไม่มีสไตล์),
dark mode CSS ใช้ไม่ได้ (เพราะ CSS ทั้งไฟล์โหลดไม่ขึ้น)
**สาเหตุ:** absolute path resolve จาก root โดเมนเสมอ ไม่ใช่จาก repo subpath — `/css/style.css` เรียก
`https://sritongdeep-eng.github.io/css/style.css` (ไม่มี `/web-novel-auto/`) ซึ่งไม่มีไฟล์จริง
**วิธีแก้:** เปลี่ยนทุก path เป็น relative ตามความลึกของไฟล์จริง (root ใช้ `css/...`, ใน `/chapters/`
ใช้ `../css/...`)
**ป้องกันไม่ให้เกิดซ้ำ:** ห้ามใช้ `/` นำหน้า path ใน static site ที่ deploy บน GitHub Pages project
subpath เด็ดขาด — ดู checklist เต็มใน `static-site-github-pages-pitfalls.md`
**เทคนิคที่ใช้:** `grep -rn 'href="/\|src="/' dist/` หลัง build ทุกครั้งเพื่อจับ absolute path ที่หลุด

---

## Error/Technique: ไม่มีหน้า Index จริง — homepage ใช้ template เดียวกับหน้าอ่านบท
**เกิดขึ้นตอน:** ออกแบบเว็บให้ `index.html` โหลด `loadChapter(0)` ผ่าน JS แทนที่จะมีหน้ารวมเรื่อง
**อาการ:** คุณโอ๊ต: "ไม่มีหน้า Index เหมือนเว็ปอื่นที่เปิดมาเป็นหน้าแรกแล้วเลือกเรื่องที่จะอ่าน"
**สาเหตุ:** ไม่เคยแยก concept "หน้ารวม/landing" ออกจาก "หน้าอ่านเนื้อหา" เลยตั้งแต่ตอนออกแบบ
**วิธีแก้:** แยก `site/templates/index.html` (landing: ปก/เรื่องย่อ/ตัวละคร/รายการบท) ออกจาก
`site/templates/chapter.html` (หน้าอ่านบทจริง) เป็นคนละไฟล์เด็ดขาด
**ป้องกันไม่ให้เกิดซ้ำ:** เว็บที่มีเนื้อหาหลายตอน/หลายหน้า ต้องมี landing page แยกจากเนื้อหาเสมอ
ถือเป็น requirement พื้นฐานตั้งแต่ตอนออกแบบโครงสร้าง ไม่ใช่ฟีเจอร์เสริม
**เทคนิคที่ใช้:** —

---

## Error/Technique: main.js เขียนทับเนื้อหาทุกหน้าด้วย Chapter 1 เสมอ
**เกิดขึ้นตอน:** ตรวจโค้ดพบระหว่างแก้บั๊กอื่น (ไม่มีใครแจ้งตรงๆ แต่เป็นบั๊กจริง)
**อาการ:** เปิดหน้า `chapters/05-xxx.html` ตรงๆ มีโอกาสเห็นเนื้อหา Chapter 1 แทน (เพราะ JS เขียนทับ
เนื้อหา static ที่ build.py generate ไว้แล้ว)
**สาเหตุ:** `let currentChapter = 0` hardcode + เรียก `loadChapter(0)` ตอน init เสมอไม่ว่าอยู่หน้าไหน
ไม่เคย detect จาก URL จริงว่ากำลังเปิดบทไหนอยู่ — เป็นการผสม SSG (build.py render static) กับ
client-side SPA fetch (main.js) สำหรับเนื้อหาเดียวกัน ทำให้ขัดแย้งกันเอง
**วิธีแก้:** ลบ client-side fetch/replace logic ออกทั้งหมด ให้ build-time render เป็นความจริงหนึ่งเดียว
(single source of truth) JS ทำหน้าที่แค่ enhance (theme, comments, reactions) ไม่แตะเนื้อหาหลัก
**ป้องกันไม่ให้เกิดซ้ำ:** อย่าผสม build-time render กับ client-side fetch สำหรับข้อมูลเดียวกัน เลือก
อย่างเดียว
**เทคนิคที่ใช้:** อ่านโค้ด main.js ทั้งไฟล์เทียบกับ build.py เพื่อหาจุดที่ logic ทับซ้อนกัน

---

## Error/Technique: "To be continued" hardcode ในเนื้อหาต้นฉบับ — หลุด 7/45 ไฟล์
**เกิดขึ้นตอน:** เขียนเนื้อหาบทแต่ละบทแยกกัน แล้วพิมพ์บรรทัด "To be continued in Chapter X: ..." ต่อท้าย
มือในไฟล์ `.md` เอง
**อาการ:** คุณโอ๊ต: "ในทุกๆหน้าจะมี To be continued... ตามด้วยชื่อตอน ซึ่งบางหน้าไม่มี" — เช็คแล้วพบว่า
7 จาก 45 ไฟล์ (chapters 02, 03, 10, 20, 30, 40, 45) ไม่มีบรรทัดนี้เลย
**สาเหตุ:** ข้อมูลที่คำนวณได้จริง (ชื่อบทถัดไป) ถูก hardcode พิมพ์มือแทนที่จะ generate — ไม่มีระบบตรวจสอบ
ความครบถ้วน ลืมใส่ก็ไม่มีอะไรเตือน
**วิธีแก้:** `python3 -c` script ลบ pattern `\n+---\n+\*To be continued in [^\n]*\*\n*$` ออกจากไฟล์ .md
ทั้งหมด แล้วให้ `build.py` generate ท้าย body_html ทุกบทที่มี `next_ch` จากข้อมูลจริง (`next_ch['title']`)
**ป้องกันไม่ให้เกิดซ้ำ:** ข้อมูลที่คำนวณได้จากข้อมูลอื่น (ลำดับ, ชื่อถัดไป/ก่อนหน้า, breadcrumb) ต้อง
generate ตอน build เสมอ ห้าม hardcode ในเนื้อหาต้นฉบับเด็ดขาด — sync จะพังทันทีที่มีการแก้ไข/เพิ่ม/
สลับลำดับในอนาคต
**เทคนิคที่ใช้:** `grep -c "To be continued" content/chapters/*.md` เทียบ count กับจำนวนไฟล์ทั้งหมด
เพื่อหาไฟล์ที่หลุด

---

## Error/Technique: escape_xml() เขียนผิด ไม่ escape อะไรเลย
**เกิดขึ้นตอน:** เขียน RSS feed generator ใน build.py
**อาการ:** (บั๊กแฝง ยังไม่ทันแสดงผลเสีย แต่เป็นระเบิดเวลาถ้าเนื้อหามี `&`/`<`/`>`)
**สาเหตุ:** โค้ดเดิม `.replace("&", "&").replace("<", "<").replace(">", ">")` — แทนที่ด้วยตัวมันเอง
เท่ากับไม่ทำอะไรเลย ทั้งที่ชื่อฟังก์ชันบอกว่า escape
**วิธีแก้:** แก้เป็น `.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")` (escape `&`
ก่อนเสมอ)
**ป้องกันไม่ให้เกิดซ้ำ:** helper function เล็กๆ (escape/sanitize/format) ต้องทดสอบด้วย input ที่มีอักขระ
พิเศษจริงอย่างน้อยครั้งเดียว ห้ามเชื่อแค่ "เขียนแล้ว ไม่มี error ตอน build"
**เทคนิคที่ใช้:** อ่านโค้ดทีละบรรทัดอย่างละเอียด (ไม่ใช่แค่ skim) เจอจากการรีวิวโค้ดตามปกติ

---

## Error/Technique: ไม่มี cache-busting — deploy ใหม่แล้ว browser ยังโชว์ของเก่า
**เกิดขึ้นตอน:** deploy รอบแรกสำเร็จ แต่ทดสอบซ้ำแล้วยังเจอปัญหาเดิม
**อาการ:** push ขึ้น GitHub สำเร็จ, ตรวจ source บน server ว่าอัปเดตถูกแล้ว แต่เปิดเว็บผ่านเบราว์เซอร์
(รวมถึงตอนคุณเต้ทดสอบเองด้วย navigate ไปที่ URL เดิมซ้ำ) ยังเห็น layout/สีแบบเก่า
**สาเหตุ:** `css/style.css` และ `js/main.js` ใช้ชื่อไฟล์เดิมทุก deploy ไม่มี versioning เลย browser
cache ไฟล์ไว้ตาม URL ถ้า URL ไม่เปลี่ยนก็ไม่บังคับ fetch ใหม่
**วิธีแก้:** เพิ่ม `hashlib.md5(...)` คำนวณ hash 8 ตัวแรกจากเนื้อหาไฟล์ css/js จริงตอน build แล้วต่อท้าย
เป็น query string `?v=<hash>` ในทุกหน้าที่ generate (`css/style.css?v=d6e45f02`)
**ป้องกันไม่ให้เกิดซ้ำ:** static site ที่ deploy ซ้ำหลายรอบต้องมี cache-busting ตั้งแต่แรก ไม่ใช่ค่อยเพิ่ม
ทีหลัง
**เทคนิคที่ใช้:** `fetch(url, {cache:'no-store'})` ตรงไปที่ production URL เพื่อเทียบเนื้อหาจริงบน server
กับสิ่งที่เห็นในเบราว์เซอร์ปกติ — ถ้าต่างกันคือโดน cache หลอก

---

## Error/Technique: `#chapter-list` CSS ผูกกับ `<li>` แต่โค้ดจริงใช้ `<a>` ข้างใน
**เกิดขึ้นตอน:** เปลี่ยนดีไซน์จาก clickable-`<li>` (SPA เดิม) มาเป็น `<a href>` จริง แต่ CSS ไม่ได้ตามไปด้วย
**อาการ:** คุณโอ๊ตส่งภาพ — ลิงก์รายการบทใน sidebar หน้าอ่านนิยาย เป็นสีน้ำเงินขีดเส้นใต้ (default
browser link) กลืนกับพื้นหลังมืด
**สาเหตุ:** styling (สี, background, padding, border-radius) เขียนไว้ที่ `#chapter-list li` แต่ตัวที่
ผู้ใช้เห็น/คลิกจริงคือ `<a>` ที่ไม่มี custom style เลย ตกไปใช้ browser default
**วิธีแก้:** ย้าย styling ทั้งหมดไป `#chapter-list a` (`display: block` ให้กิน padding เอง), `<li>` เหลือ
แค่ `margin: 0`
**ป้องกันไม่ให้เกิดซ้ำ:** เปลี่ยนโครงสร้าง HTML ทุกครั้ง (เช่น div→a) ต้องไล่เช็ค CSS selector เดิมทั้งหมด
ว่ายัง target element ที่ถูกต้องอยู่ไหม
**เทคนิคที่ใช้:** `getComputedStyle()` ผ่าน `javascript_tool` เทียบ `color`/`background-color`/
`text-decoration-line` ตรงๆ บนเว็บจริง แทนการเดาจาก CSS source อย่างเดียว

---

## Error/Technique: CSS specificity สองกฎเท่ากันพอดี — active state หายในโหมดมืด
**เกิดขึ้นตอน:** แก้บั๊กที่ 7 (ด้านบน) เสร็จ แล้วตรวจเจิงเพิ่ม
**อาการ:** บทที่กำลังเปิดอ่านอยู่ ไม่ขึ้น highlight สี accent ใน sidebar เฉพาะตอนอยู่ dark mode (light
mode ปกติดี)
**สาเหตุ:** `#chapter-list li.active a` กับ `body.dark-theme #chapter-list a` มี specificity เท่ากัน
พอดี (id+class+2element ทั้งคู่) — กฎ dark-theme เขียนอยู่ท้ายไฟล์ (หลัง section .active) เลยชนะเสมอ
ตาม CSS cascade เมื่อ specificity เท่ากัน ("ใครมาทีหลังชนะ")
**วิธีแก้:** เพิ่มกฎ `body.dark-theme #chapter-list li.active a { ... }` (specificity สูงกว่าทั้งคู่)
วางไว้หลังสุด
**ป้องกันไม่ให้เกิดซ้ำ:** เขียน CSS ที่มีทั้ง theme override + state override บน element เดียวกัน ต้อง
เช็ค specificity คู่กันเสมอ ถ้าเท่ากันให้รวม selector เป็นกฎเดียวเพื่อความชัวร์ อย่าปล่อยให้ source order
ตัดสินโดยไม่ตั้งใจ
**เทคนิคที่ใช้:** `getComputedStyle()` เทียบค่าที่ apply จริงกับตัวแปร CSS (`getPropertyValue`) — ถ้า
ตัวแปรถูกต้องแต่ค่าที่ apply จริงไม่ตรง แปลว่ามีกฎอื่นชนะอยู่ ต้องไล่หา selector ที่ specificity สูงกว่า

---

## Error/Technique: สีตัวหนังสือปุ่มผูกกับ theme variable ทั้งที่พื้นหลังปุ่ม fix ตายตัว
**เกิดขึ้นตอน:** คุณโอ๊ตส่งภาพปุ่ม Previous/Next/Post Comment
**อาการ:** ตัวหนังสือขาวเกือบมองไม่เห็นบนพื้นปุ่มสีขาว/ครีม (คอนทราสต์แทบเป็นศูนย์) เฉพาะใน dark mode
**สาเหตุ:** `.nav-button` ตั้งใจให้พื้นหลังเป็น gradient ขาว/ครีม **คงที่ทั้งสองโหมด** (ไม่สลับตามธีม)
แต่ `color: var(--text-primary)` สลับตามธีม (เกือบขาวใน dark mode) — พื้น fix + ตัวหนังสือ dynamic
ชนกันพอดีตอน dark mode
**วิธีแก้:** เปลี่ยนเป็น `color: #2D3748` (fix ตายตัว ไม่ผูก var) ให้ตรงกับพื้นหลังที่ fix เหมือนกัน
**ป้องกันไม่ให้เกิดซ้ำ:** สีตัวหนังสือกับพื้นหลังของ element เดียวกันต้องผูกกับ mechanism เดียวกันเสมอ
(ทั้งคู่ fix หรือทั้งคู่ dynamic ตามธีม) ห้ามผสม
**เทคนิคที่ใช้:** ตรวจทุก `.nav-button`-class element (Prev/Next/Post Comment ใช้ class เดียวกัน) พร้อม
กันในครั้งเดียว หลัง fix แล้วต้องเช็คว่า element อื่นที่ใช้ class เดียวกันได้รับผลด้วยหรือไม่

---

## สรุปตัวเลข
- อาการที่คุณโอ๊ตแจ้งเข้ามาโดยตรง: 8 ครั้ง (3 รอบสนทนา)
- Root cause จริงที่แก้ไปทั้งหมด: 9 บั๊ก (2 ในนั้นเป็นบั๊กแฝงที่เจอเองระหว่างตรวจโค้ด ไม่มีใครแจ้ง)
- Commit ที่ deploy จริงทั้งหมด: `ae3eb3e` → `deda260` → `eb6a05a` → `cdd180d` (branch `main`)
