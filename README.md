# PAW HOUSE — Pet Grooming Studio demo

HTML5 / CSS3 / Vanilla JavaScript. Fully static, GitHub Pages-ready; no backend or build tools.

## გაშვება და გამოქვეყნება
1. გახსენით `index.html` პირდაპირ ბრაუზერში.
2. არქივის შიგთავსი ატვირთეთ GitHub რეპოზიტორიის root-ში.
3. Settings → Pages → Deploy from a branch → main → /(root) → Save.
4. რესურსების ყველა გზა ფარდობითია და repository subpath-ზეც მუშაობს.
5. რეალური URL-ის მიღების შემდეგ og:image-ში ჩაწერეთ hero-1400.webp ფოტოს სრული HTTPS URL. სურვილისამებრ დაამატეთ რეალური og:url და canonical.

## კონტაქტების მორგება
`js/data.js`-ში `PAW_CONFIG` შეიცავს whatsappNumber-ს და callNumber-ს.

შეიყვანეთ რეალური საერთაშორისო ნომერი ქვეყნის კოდით, მხოლოდ ციფრებით; პლუსის გარეშე. Default values are empty so no fictional phone number is presented as working.

- WhatsApp, empty number: recipient-free link with a prepared demo inquiry; the visitor selects a recipient and decides whether to send.
- WhatsApp, confirmed number configured: the prepared inquiry targets that number.
- Call, empty number: opens a clear demo explanation; no telephone action is initiated.
- Call, confirmed number configured: opens the phone handler using tel:+number.

The site itself never sends a WhatsApp message or creates a booking. No actual phone number is included in the deliverable.

## ფორმა და ინტერაქციები
- KA/EN თარგმნის ტექსტებს, არჩევანის ვარიანტებს, accessibility labels-ს და SEO metadata-ს; ინახება მხოლოდ paw-house-language.
- 6 illustrative services. Dog/cat selection shows only compatible services; shared services remain selected when appropriate.
- Service, pet-card and package buttons preselect pet/service in the inquiry form.
- Frontend validation: owner name, phone format, pet name, pet type, compatible service, optional future/today date.
- A preferred date is only a preference; no time slots, availability or real confirmations are fabricated.
- Demo completion clears form fields. No data is sent or stored; submit remains disabled without JavaScript.
- Gallery filter, native dialog lightbox, arrow keys, Escape, swipe and focus restoration.
- Before/after divider uses the same illustrative photo on both sides. No grooming result is represented.
- Responsive WebP variants, native lazy loading, local fonts, reduced-motion support, mobile menu and sticky mobile booking/call controls.

## ადაპტაცია რეალური სტუდიისთვის
Replace demo copy, prices, package contents, opening hours and contact information with confirmed business details. Replace photographs with authorised studio imagery. No qualifications, outcome claims or safety guarantees are implied in the demo. Actual bookings would require a separately configured integration.

Update BOTH data-ka and data-en values in index.html. Service data is in js/data.js and must remain consistent with service cards. Confirm compatible pet types with the business before changing availability.

## Structure
index.html
css/style.css
js/data.js
js/script.js
assets/images/
assets/fonts/
assets/favicon.svg
CREDITS.md
QA.md
