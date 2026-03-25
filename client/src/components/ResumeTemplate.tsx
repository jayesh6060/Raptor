'use client';

import React from 'react';
import {
  Mail,
  Phone,
  Linkedin,
  MapPin,
  Star,
  Flag,
  Users,
  Heart
} from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * HAZEL CLARK PIXEL-PERFECT RESUME TEMPLATE (COLOR-STABLE VERSION)
 * Design: Two-column, Enhancv-style, solid section dividers, precise icons.
 * Compatibility: Forced Hex colors to avoid html2canvas "lab()" parsing errors.
 */
interface ResumeTemplateProps {
  profile: any; // Assuming 'any' for profile based on original code, but could be more specific if Profile type is defined elsewhere.
  academicData: any[];
  customName?: string;
}

export const ResumeTemplate = ({ profile, academicData, customName }: ResumeTemplateProps) => {
  if (!profile) return null;

  // Synthesis logic for the "1 into 100" professionalization
  const averageScore = academicData.length > 0
    ? (academicData.reduce((acc, curr) => acc + curr.score, 0) / academicData.length).toFixed(1)
    : '8.48';

  // Forced HEX constants to avoid "lab()" color parsing errors in html2canvas
  const HEX_BLUE = "#008ecc";
  const HEX_SLATE_900 = "#0f172a";
  const HEX_SLATE_700 = "#334155"; // Added for text-slate-700
  const HEX_SLATE_600 = "#475569";
  const HEX_SLATE_500 = "#64748b";
  const HEX_SLATE_400 = "#94a3b8";
  const HEX_SLATE_300 = "#cbd5e1";
  const HEX_SLATE_200 = "#e2e8f0"; // Added for border-slate-200
  const HEX_SLATE_100 = "#f1f5f9";
  const HEX_SLATE_50 = "#f8fafc";
  const HEX_WHITE = "#ffffff";
  // const HEX_INDIGO_100 = "#e0e7ff"; // Not used in the provided styles

  return (
    <div
      id="resume-document"
      style={{ width: '210mm', minHeight: '297mm', backgroundColor: HEX_WHITE, color: HEX_SLATE_900, padding: '64px', fontFamily: 'sans-serif', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px', lineHeight: '1.6' }}
    >

      {/* HEADER: Precise Enhancv Header */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '40px',
        paddingBottom: '32px',
        borderBottom: `2px solid ${HEX_SLATE_200}`
      }}>
        <div style={{ flex: 1 }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: '900',
            color: HEX_SLATE_900,
            letterSpacing: '-0.025em',
            marginBottom: '8px',
            textTransform: 'uppercase'
          }}>
            {customName || profile?.name || 'MALLI'}
          </h1>
          <p style={{ fontSize: '18px', fontWeight: '700', letterSpacing: '-0.025em', color: HEX_BLUE, marginBottom: '16px', fontStyle: 'italic' }}>
            Marketing Manager & Specialist
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', fontSize: '10px', fontWeight: '700', color: HEX_SLATE_500 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={12} style={{ color: HEX_BLUE }} /> +123-456-7890</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={12} style={{ color: HEX_BLUE }} /> hello@reallygreatsite.com</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={12} style={{ color: HEX_BLUE }} /> 123 Anywhere St.. Any City</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Image size={10} style={{ color: HEX_BLUE }} /> www.reallygreatsite.com</div>
          </div>
        </div>
        <div style={{ width: '112px', height: '112px', borderRadius: '9999px', overflow: 'hidden', border: `4px solid ${HEX_SLATE_50}`, boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', marginLeft: '32px' }}>
          <img
            src={profile.avatar || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%23008ecc' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2'%3E%3C/path%3E%3Ccircle cx='12' cy='7' r='4'%3E%3C/circle%3E%3C/svg%3E"}
            alt="Profile"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            crossOrigin="anonymous"
          />
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '40px' }}>

        {/* LEFT COMPONENT (60%) */}
        <div style={{ gridColumn: 'span 7 / span 7', display: 'flex', flexDirection: 'column', gap: '40px' }}>

          <section>
            <h2 style={{ fontSize: '14px', fontWeight: '900', color: HEX_SLATE_900, textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: `2px solid ${HEX_SLATE_900}`, paddingBottom: '4px', marginBottom: '16px' }}>Profile Summary</h2>
            <p style={{ fontSize: '12px', color: HEX_SLATE_600, fontWeight: '500', lineHeight: '1.6' }}>
              Experienced and results-driven Marketing Manager with a proven track record in developing and executing successful marketing strategies. I am seeking a challenging role where I can contribute my skills in strategic planning, team leadership, and creative problem-solving to achieve business objectives.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '14px', fontWeight: '900', color: HEX_SLATE_900, textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: `2px solid ${HEX_SLATE_900}`, paddingBottom: '4px', marginBottom: '24px' }}>Work Experience</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: HEX_SLATE_900, marginBottom: '2px' }}>Marketing Manager & Specialist</h3>
                <p style={{ fontSize: '13px', fontWeight: '700', color: HEX_BLUE }}>Borcelle Studio</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '9px', color: HEX_SLATE_400, fontWeight: '700', textTransform: 'uppercase', marginBottom: '12px' }}>
                  <div>2030 - PRESENT</div>
                </div>
                <ul style={{ fontSize: '11px', color: HEX_SLATE_600, display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '20px', listStyleType: 'disc', fontWeight: '500' }}>
                  <li>Led the development and implementation of comprehensive marketing strategies that resulted in a 20% increase in brand Visibility and a 15% growth in sales within the first year.</li>
                  <li>Successfully launched and managed multiple cross-channel campaigns, including digital marketing, social media, and traditional advertising, resulting in improved customer acquisition and retention rates.</li>
                </ul>
              </div>

              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: HEX_SLATE_900, marginBottom: '2px' }}>Marketing Manager & Specialist</h3>
                <p style={{ fontSize: '13px', fontWeight: '700', color: HEX_BLUE }}>Fauget Studio</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '9px', color: HEX_SLATE_400, fontWeight: '700', textTransform: 'uppercase', marginBottom: '12px' }}>
                  <div>2025 - 2029</div>
                </div>
                <ul style={{ fontSize: '11px', color: HEX_SLATE_600, display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '20px', listStyleType: 'disc', fontWeight: '500' }}>
                  <li>Conducted market research to identify emerging trends and consumer preferences, providing valuable insights for product development and positioning.</li>
                  <li>Oversaw the creation of engaging content for various platforms, collaborating with internal teams and external agencies to ensure brand consistency and relevance.</li>
                </ul>
              </div>

              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: HEX_SLATE_900, marginBottom: '2px' }}>Marketing Manager & Specialist</h3>
                <p style={{ fontSize: '13px', fontWeight: '700', color: HEX_BLUE }}>Studio Shodwe</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '9px', color: HEX_SLATE_400, fontWeight: '700', textTransform: 'uppercase', marginBottom: '12px' }}>
                  <div>2024 - 2025</div>
                </div>
                <ul style={{ fontSize: '11px', color: HEX_SLATE_600, display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '20px', listStyleType: 'disc', fontWeight: '500' }}>
                  <li>Developed and executed targeted marketing campaigns, resulting in a 25% increase in lead generation.</li>
                  <li>Implemented SEO strategies that improved website traffic by 30% enhancing online visibility and positioning the company.</li>
                  <li>Collaborated with sales teams to create effective sales collateral presentations, and promotional materials.</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: '14px', fontWeight: '900', color: HEX_SLATE_900, textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: `2px solid ${HEX_SLATE_900}`, paddingBottom: '4px', marginBottom: '16px' }}>Education</h2>
            <div style={{ borderLeft: `2px solid ${HEX_SLATE_100}`, paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: '700', color: HEX_SLATE_900 }}>Borcelle University</h3>
                <p style={{ fontSize: '12px', color: HEX_BLUE, fontWeight: '600' }}>Master of Business Management | 2029 - 2030</p>
              </div>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: '700', color: HEX_SLATE_900 }}>Borcelle University</h3>
                <p style={{ fontSize: '12px', color: HEX_BLUE, fontWeight: '600' }}>Bachelor of Business Management | 2025 - 2029</p>
                <p style={{ fontSize: '11px', color: HEX_SLATE_500, fontWeight: '700' }}>GPA: 3.8/4.0</p>
              </div>
            </div>
          </section>

        </div>

        {/* RIGHT COMPONENT (40%) */}
        <div style={{ gridColumn: 'span 5 / span 5', display: 'flex', flexDirection: 'column', gap: '40px' }}>

          <section>
            <h2 style={{ fontSize: '14px', fontWeight: '900', color: HEX_SLATE_900, textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: `2px solid ${HEX_SLATE_900}`, paddingBottom: '4px', marginBottom: '24px' }}>Skills</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
              {['Project Management', 'Public Relations', 'Teamwork', 'Time Management', 'Leadership', 'Effective Communication', 'Critical Thinking'].map((skill: string) => (
                <div key={skill} style={{ fontSize: '11px', fontWeight: '700', color: HEX_SLATE_700, borderBottom: `2px solid ${HEX_SLATE_100}`, paddingBottom: '4px' }}>{skill}</div>
              ))}
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: '14px', fontWeight: '900', color: HEX_SLATE_900, textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: `2px solid ${HEX_SLATE_900}`, paddingBottom: '4px', marginBottom: '24px' }}>Languages</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '700', color: HEX_SLATE_700 }}>
                <span>English</span>
                <span style={{ color: HEX_BLUE }}>Fluent</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '700', color: HEX_SLATE_700 }}>
                <span>French</span>
                <span style={{ color: HEX_BLUE }}>Fluent</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '700', color: HEX_SLATE_700 }}>
                <span>Spanish</span>
                <span style={{ color: HEX_BLUE }}>Intermediate</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '700', color: HEX_SLATE_700 }}>
                <span>German</span>
                <span style={{ color: HEX_SLATE_500 }}>Basics</span>
              </div>
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: '14px', fontWeight: '900', color: HEX_SLATE_900, textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: `2px solid ${HEX_SLATE_900}`, paddingBottom: '4px', marginBottom: '24px' }}>Institutional Sync</h2>
            <p style={{ fontSize: '10px', color: HEX_SLATE_500, fontWeight: '500', lineHeight: '1.4' }}>
              Academic artifacts verified via Raptor Institutional Node USN: {profile.usn || '4JD24CS109'}.
            </p>
          </section>

        </div>
      </div>

      <footer style={{ marginTop: 'auto', paddingTop: '40px', borderTop: `1px solid ${HEX_SLATE_100}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '9px', fontWeight: '700', color: HEX_SLATE_300, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        <span>www.reallygreatsite.com</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: '0.6' }}>Powered by Enhancv <Image size={10} style={{ color: HEX_SLATE_300 }} /></span>
      </footer>

    </div>
  );
};

const Image = ({ size, style }: { size: number, style?: any }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
  </svg>
);
