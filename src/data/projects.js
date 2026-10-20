import { img } from '@/utils/asset';

/** Tabs, in display order. `comingSoon` tabs show the Coming Soon panel instead of cards. */
const tabs = [
  { name: 'ReactJS' },
  { name: 'CMS' },
  { name: 'Ecommerce' },
  { name: 'SEO' },
  { name: 'Social Media', comingSoon: true },
  { name: 'Figma Works', comingSoon: true },
];

/** Live React builds — images are home-page captures (1440×900) stored in public/assets/imgs. */
const reactProjects = [
  { title: 'Ela Bazar', href: 'https://elabazar.com/', image: 'react-elabazar.jpg' },
  { title: 'Vedant Solutions', href: 'https://collegepredictor.vedantedu.com/', image: 'react-vedant-college-predictor.jpg' },
  { title: 'Equinox Sports Infra', href: 'https://equinox-five-sooty.vercel.app/', image: 'react-equinox.jpg' },
  { title: 'Iraa', href: 'https://iraa.co/', image: 'react-iraa.jpg' },
  { title: 'VizeDraw', href: 'https://www.vizedraw.com/', image: 'react-vizedraw.jpg' },
  { title: 'Delhi World Public School', href: 'https://www.delhiworldpublicschool.in/', image: 'react-delhi-world-public-school.jpg' },
  { title: 'Dexterity Venture', href: 'https://www.dexterityventure.com/', image: 'react-dexterity-venture.jpg' },
  { title: 'Savore', href: 'https://www.savore.co.in/', image: 'react-savore.jpg' },
  { title: 'Aasta Lifespace', href: 'https://www.aastalifespace.com/', image: 'react-aasta-lifespace.jpg' },
  { title: 'Banyan Tree Group', href: 'https://banyantree01-five.vercel.app/', image: 'react-banyan-tree.jpg' },
  { title: 'Third Way Advisory', href: 'https://third-wave-advisory.vercel.app/', image: 'react-third-wave-advisory.jpg' },
  { title: 'National Roofing Services', href: 'https://national-roofing-alpha.vercel.app/', image: 'react-national-roofing.jpg' },
].map((p) => ({ ...p, category: 'ReactJS' }));

/** Live CMS builds — same capture setup as above. */
const cmsProjects = [
  { title: 'Omnitec Security Systems', href: 'https://www.omnitecgroup.com/', image: 'cms-omnitec-group.jpg' },
  { title: 'Moldtek Technologies', href: 'https://www.moldtekengineering.com/', image: 'cms-moldtek-engineering.jpg' },
  { title: 'CASS Parking', href: 'https://www.cassparking.com/', image: 'cms-cass-parking.jpg' },
  { title: 'Nuself', href: 'https://www.nuself.com/', image: 'cms-nuself.jpg' },
  { title: 'Amegundi Resort', href: 'https://www.amegundi.com/', image: 'cms-amegundi.jpg' },
  { title: 'Kaadgal Resort', href: 'https://www.kaadgalresort.com/', image: 'cms-kaadgal-resort.jpg' },
  { title: 'MindParkour', href: 'https://www.mindparkour.in/', image: 'cms-mind-parkour.jpg' },
  { title: 'Fortira', href: 'https://fortira.com/', image: 'cms-fortira.jpg' },
  { title: 'Canarys', href: 'https://ecanarys.com/', image: 'cms-ecanarys.jpg' },
  { title: 'Benchmark Interio', href: 'https://www.benchmarkinterio.com/', image: 'cms-benchmark-interio.jpg' },
  { title: 'MadoX Technologies', href: 'https://www.madox.my/', image: 'cms-madox.jpg' },
  { title: 'Engrix', href: 'https://engrix.com/', image: 'cms-engrix.jpg' },
  { title: 'Durbar', href: 'https://www.durbar.fr/', image: 'cms-durbar.jpg' },
  { title: 'Medloogle', href: 'https://www.medloogle.com/', image: 'cms-medloogle.jpg' },
  { title: 'SMV Travels', href: 'https://smvtravels.in/', image: 'cms-smv-travels.jpg' },
  { title: 'Meterparker', href: 'https://www.meterparker.com/', image: 'cms-meter-parker.jpg' },
  { title: 'Nuself Surgical Group', href: 'https://www.nuselfsurgicalgroup.com/', image: 'cms-nuself-surgical-group.jpg' },
  { title: 'Qval Consulting', href: 'https://www.qvalconsulting.com/', image: 'cms-qval-consulting.jpg' },
  { title: 'Shree Natural Jaggery', href: 'https://www.shreejaggery.com/', image: 'cms-shree-jaggery.jpg' },
  { title: 'Vedant Solutions', href: 'https://www.vedantedu.com/', image: 'cms-vedant-edu.jpg' },
  { title: 'Zeus India', href: 'https://www.zeusagro.in/', image: 'cms-zeus-agro.jpg' },
  { title: 'Winpro uPVC', href: 'https://winproupvc.com/', image: 'cms-winpro-upvc.jpg' },
  { title: 'Mestri', href: 'https://mestri.co.in/', image: 'cms-mestri.jpg' },
  { title: 'Shifa Wellness', href: 'https://www.shifawellness.in/', image: 'cms-shifa-wellness.jpg' },
  { title: 'Inner Light Healing', href: 'https://innerlightritual.com/', image: 'cms-inner-light-ritual.jpg' },
  { title: 'Heshi Farm', href: 'https://www.heshifarm.com/', image: 'cms-heshi-farm.jpg' },
].map((p) => ({ ...p, category: 'CMS' }));

/** Ecommerce builds — several reuse the home-page capture already taken for another tab. */
const ecommerceProjects = [
  { title: 'Ela Bazar', href: 'https://elabazar.com/', image: 'react-elabazar.jpg' },
  { title: 'Inner Light Healing', href: 'https://innerlightritual.com/', image: 'cms-inner-light-ritual.jpg' },
  { title: 'Medloogle', href: 'https://www.medloogle.com/', image: 'cms-medloogle.jpg' },
  { title: 'Shree Natural Jaggery', href: 'https://www.shreejaggery.com/', image: 'cms-shree-jaggery.jpg' },
  { title: 'Ela Foods', href: 'https://www.elafoods.in/', image: 'ecom-ela-foods.jpg' },
].map((p) => ({ ...p, category: 'Ecommerce' }));

/** SEO clients — captures shared with other tabs where the same site already appears. */
const seoProjects = [
  { title: 'Omnitec Security Systems', href: 'https://www.omnitecgroup.com/', image: 'cms-omnitec-group.jpg' },
  { title: 'Omnitec Systems India', href: 'https://omnitecindia.com/', image: 'seo-omnitec-india.jpg' },
  { title: 'CASS Parking', href: 'https://www.cassparking.com/', image: 'cms-cass-parking.jpg' },
  { title: 'Amegundi Resort', href: 'https://www.amegundi.com/', image: 'cms-amegundi.jpg' },
  { title: 'Moldtek Technologies', href: 'https://www.moldtekengineering.com/', image: 'cms-moldtek-engineering.jpg' },
  { title: 'Delhi World Public School', href: 'https://www.delhiworldpublicschool.in/', image: 'react-delhi-world-public-school.jpg' },
  { title: 'Dexterity Venture', href: 'https://www.dexterityventure.com/', image: 'react-dexterity-venture.jpg' },
  { title: 'MadoX Technologies India', href: 'https://madox.in/', image: 'seo-madox-india.jpg' },
  { title: 'Aasta Lifespace', href: 'https://www.aastalifespace.com/', image: 'react-aasta-lifespace.jpg' },
  { title: 'Vedant Solutions', href: 'https://www.vedantedu.com/', image: 'cms-vedant-edu.jpg' },
  { title: 'MadoX Technologies Malaysia', href: 'https://www.madox.my/', image: 'cms-madox.jpg' },
].map((p) => ({ ...p, category: 'SEO' }));

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const projects = [...reactProjects, ...cmsProjects, ...ecommerceProjects, ...seoProjects].map((p, i) => ({
  ...p,
  id: i + 1,
  slug: `${slugify(p.title)}-${i + 1}`,
  image: img(p.image),
}));

export const categories = tabs.map((t) => ({ name: t.name, comingSoon: Boolean(t.comingSoon) }));
