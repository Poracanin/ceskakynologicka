// Run with a local HTTP server and Playwright installed.
// BASE_URL defaults to http://127.0.0.1:4173. BROWSER_CHANNEL=chrome uses installed Chrome.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.BASE_URL || 'http://127.0.0.1:4173';
const screenshots = process.env.SCREENSHOT_DIR;
const errors = [];
let checks = 0;
function check(condition, description) { assert.ok(condition, description); checks++; console.log(`✓ ${description}`); }
async function shot(page, name, fullPage = true) {
  if (screenshots) { fs.mkdirSync(screenshots, { recursive:true }); await page.screenshot({path:`${screenshots}/${name}.png`,fullPage}); }
}
async function visible(page, selector) { await page.locator(selector).waitFor({state:'visible'}); }
async function login(page) {
  await visible(page, '#hero-login-form');
  await page.locator('#hero-login-form [name=email]').fill('demo');
  await page.locator('#hero-login-form [name=password]').fill('test');
  await page.locator('#hero-login-form button[type=submit]').click();
  await visible(page,'#member-portal');
}
async function clickRoute(page, hash) {
  await page.evaluate(hash => navigatePublic(hash), hash);
}
(async () => {
 const browser = await chromium.launch({headless:true,channel:process.env.BROWSER_CHANNEL || undefined});
 try {
  const page = await browser.newPage({viewport:{width:1440,height:1000}});
  // Demo events have fixed 2026 dates; keep this flow before their deadlines.
  await page.clock.setFixedTime(new Date('2026-08-16T12:00:00+02:00'));
  page.on('pageerror', e=>errors.push(e.message));
  page.setDefaultTimeout(10000);
  await page.goto(base);
  check(await page.locator('#brand-intro').isVisible(),'Animated brand entrance appears on initial visit');
  check(await page.locator('#brand-intro button').count()===0,'Intro has no continue button');
  await shot(page,'intro',false);
  await page.locator('#brand-intro').waitFor({state:'hidden',timeout:4000});
  check(!await page.locator('body').evaluate(e=>e.classList.contains('intro-active')),'Intro automatically reveals the website and restores scrolling');
  check(await page.locator('#hero-login-form').isVisible(),'Home opens directly with login');
  check(await page.locator('[data-hero-register]').isVisible(),'Home offers account registration');
  check(await page.locator('#event-list button').count()===0,'Guest exhibition rows have no active actions');
  check(await page.locator('#event-list .event-card').first().evaluate(e=>getComputedStyle(e).opacity)==='1','Exhibition previews are visible');
  check(await page.locator('#region-filter').count()===0,'Region filter removed');
  await shot(page,'home-desktop');
  await page.locator('#event-search').fill('Brno');
  check(await page.locator('#event-list .event-card').count()===1,'Search by city works');
  await page.locator('#event-search').fill('missing-place');
  check(await page.locator('#empty-state').isVisible(),'Empty search state works');
  await page.locator('#empty-reset').click();
  await page.waitForFunction(()=>document.querySelectorAll('#event-list .event-card').length===6);
  await page.locator('#type-filter').selectOption('Klubová');
  check(await page.locator('#event-list .event-card').count()===1,'Type filter works without regions');
  await page.locator('#filter-reset').click();
  await page.waitForFunction(()=>document.querySelectorAll('#event-list .event-card').length===6);
  await page.locator('#date-filter').selectOption('2026-10-10');
  check(await page.locator('#event-list .event-card').count()===1,'Date filter narrows the public list');
  await page.locator('#filter-reset').click();
  await page.waitForFunction(()=>document.querySelectorAll('#event-list .event-card').length===6);
  await page.locator('.desktop-nav a[href="#klub"]').click();
  check(await page.locator('.club-section').isVisible(),'Club is public');
  await page.locator('.journal-feature:visible').click();
  check(await page.locator('.article-prose > section').count()===6,'Full article has six sections');
  await page.locator('.article-toc a').last().click();
  check(await page.locator('.club-article').isVisible(),'Article contents navigation stays in article');
  await page.goBack();
  check(await page.locator('.club-article').isVisible(),'Browser Back restores article');
  await page.locator('.desktop-nav a[href="#vystavy"]').click();
  check(await page.locator('#hero-login-form').isVisible(),'Exhibition navigation requires login');
  check(!await page.locator('#member-portal').isVisible(),'Member content stays hidden for guests');
  await page.locator('#hero-login-form button[type=submit]').click();
  check(await page.locator('#hero-login-form [name=email]').evaluate(e=>e.classList.contains('invalid')),'Empty credentials rejected');
  await login(page);
  check(await page.locator('#member-event-grid .member-event-card').count()===6,'Login opens six member exhibitions');
  await page.locator('#member-event-search').fill('Praha');
  check(await page.locator('#member-event-grid .member-event-card').count()===1,'Member search filters by city');
  await page.locator('#member-event-search').fill('missing-place');
  check(await page.locator('#member-events-empty').isVisible(),'Member search has a recoverable empty state');
  await page.locator('#member-events-reset').click();
  await page.waitForFunction(()=>document.querySelectorAll('#member-event-grid .member-event-card').length===6);
  await page.locator('[data-member-event-detail]').first().click();
  await visible(page,'#event-dialog');
  check(await page.locator('#event-dialog h2').textContent()==='Národní výstava psů Brno','Authenticated detail opens');
  await page.locator('#event-dialog [data-close-dialog]').click();
  await page.locator('[data-member-apply="6"]').click();
  await visible(page,'#application-workspace');
  check(await page.locator('dialog[open]').count()===0,'Application uses the member workspace rather than a dialog');
  check((await page.locator('#application-event-name').textContent()).includes('ovčáckých'),'Application keeps the selected event');
  check(await page.locator('.application-dog-choice').count()===2,'Saved dogs are available');
  await page.locator('#application-workspace [data-member-panel=member-events]').click();
  await page.locator('#member-portal [data-member-panel=dogs]').first().click();
  await page.locator('#member-portal [data-dog-select="argo"]').first().click();
  check(await page.locator('#dog-profile-view').isVisible(),'Saved dog opens overview');
  check(!await page.locator('#dog-create-view').isVisible(),'Overview does not open editor');
  await page.locator('[data-edit-dog]:visible').click();
  check(await page.locator('#dog-create-view').isVisible(),'Explicit edit opens dog form');
  await page.locator('[data-cancel-dog-create]:visible').first().click();
  await page.locator('#member-portal [data-open-dog]:visible').first().click();
  check(await page.locator('#dog-create-form input[name=newDogName]').inputValue()==='', 'New dog does not reuse existing name');
  await page.locator('[data-cancel-dog-create]:visible').first().click();
  await page.locator('#member-portal [data-exit-portal]').first().click();
  check(await page.locator('#desktop-profile-link').isVisible(),'Public navigation includes My profile after login');
  check(await page.locator('#header-member-label').textContent()==='Petr Novák','Public header retains member identity');
  check(await page.locator('#hero-member-session').isVisible(),'Home shows signed-in account');
  check((await page.locator('#hero-member-session h2').textContent()).includes('Petr Novák'),'Home retains member identity');
  check(await page.locator('#event-list [data-event-detail]').count()===6,'Authenticated preview unlocks details');
  await page.locator('#desktop-profile-link').click();
  check(await page.locator('[data-member-content=profile]').evaluate(e=>e.classList.contains('active')),'My profile opens personal data');
  await page.locator('#member-portal [data-sign-out]').click();
  check(await page.locator('#event-list button').count()===0,'Logout locks all public rows');
  await page.goBack();
  check(!await page.locator('#member-portal').isVisible(),'Browser Back cannot restore logged-out access');
  await page.goto(base+'/#vystavy');
  check(await page.locator('#hero-login-form').isVisible(),'Direct exhibition URL requires login');
  await login(page);
  await page.reload();
  check(await page.locator('#hero-login-form').isVisible(),'Reload clears demo member session');
  check(await page.evaluate(()=>localStorage.length===0 && sessionStorage.length===0),'Authentication does not use browser storage');
  await page.evaluate(()=>openApplication(6));
  await login(page);
  await visible(page,'#application-workspace');
  check((await page.locator('#application-event-name').textContent()).includes('ovčáckých'),'Pending application resumes after login');
  await page.locator('#application-workspace [data-member-panel=member-events]').click();
  await page.locator('#member-portal [data-sign-out]').click();
  await page.evaluate(()=>openEventDetail(2));
  check(!await page.locator('#event-dialog').isVisible(),'Detail function also enforces authentication');
  await login(page);
  await visible(page,'#event-dialog');
  check(await page.locator('#event-dialog h2').textContent()==='Prague Expo Dog','Pending detail resumes after login');
  await page.locator('#event-dialog [data-close-dialog]').click();
  await page.locator('#member-portal [data-sign-out]').click();
  await page.locator('.footer-organizer').click();
  await page.locator('#admin-access-form [name=adminPassword]').fill('wrong');
  await page.locator('#admin-access-form button[type=submit]').click();
  check(await page.locator('#admin-access-error').isVisible(),'Incorrect organizer password rejected');
  await page.locator('#admin-access-form [name=adminPassword]').fill('123456');
  await page.locator('#admin-access-form button[type=submit]').click();
  check(await page.locator('#admin-portal').isVisible(),'Separate organizer demo password works');
  check(!await page.locator('#admin-sidebar').isVisible(),'Organizer sidebar starts collapsed');
  await page.locator('#admin-sidebar-toggle').click();
  await page.locator('#admin-portal [data-admin-panel=admin-events]').first().click();
  await page.locator('#admin-event-list [data-admin-show-registrations]').first().click();
  check(await page.locator('#admin-show-registrations').isVisible(),'Organizer registrations remain functional');
  await page.locator('#admin-portal [data-exit-portal]').first().click();
  await page.locator('#header-register-button').click();
  check(await page.locator('#hero-register-form').isVisible(),'Registration opens as a page');
  check(await page.locator('#hero-register-form [name=marketing]').isChecked()===false,'Marketing consent starts unchecked');
  await page.locator('#hero-register-form button[type=submit]').click();
  check(await page.locator('#registration-error-summary').isVisible(),'Registration validation and error links work');
  await page.locator('[data-hero-login]').click();
  check(await page.locator('#hero-login-form').isVisible(),'Registration returns to login');
  await page.goto(base);
  await page.locator('#brand-intro').waitFor({state:'hidden'});
  check(await page.locator('.welcome-section').isVisible(),'Logo automatically reveals home');
  for(const width of [320,390,768,1024,1440]) {
   await page.setViewportSize({width,height:900});
   for(const route of ['uvod','klub','vystava-exterieru-psu','prihlaseni','registrace']) {
    await clickRoute(page,route);
    check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${route} fits width ${width}`);
    if([390,1440].includes(width)) await shot(page,`${route}-${width}`);
   }
  }
  await page.setViewportSize({width:390,height:844});
  await clickRoute(page,'uvod');
  await page.locator('.menu-button').click();
  check(await page.locator('.mobile-nav').isVisible(),'Mobile menu opens');
  await page.locator('.mobile-nav a[href="#klub"]').click();
  check(!await page.locator('.mobile-nav').isVisible() && await page.locator('.club-section').isVisible(),'Mobile menu navigates and closes');
  const duplicates = await page.evaluate(()=>{ const ids=[...document.querySelectorAll('[id]')].map(e=>e.id); return ids.filter((id,i)=>ids.indexOf(id)!==i); });
  check(duplicates.length===0,'No duplicate DOM ids');
  check(errors.length===0,`No JavaScript errors: ${errors.join(', ')}`);
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto(base);
  check(!await page.locator('#brand-intro').isVisible(),'Reduced motion skips introductory delay');
  console.log(`Passed ${checks} checks; no JavaScript errors.`);
 } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1;});
