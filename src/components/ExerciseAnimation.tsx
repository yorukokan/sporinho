import React, { useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { AnimationKind } from '../types';

interface ExerciseAnimationProps {
  kind: AnimationKind;
  tempo?: string;
  compact?: boolean;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

// Smooth movement curve with brief pause at start and peak contraction
function smoothCycle(rawPhase: number): { t: number; stage: 'start' | 'eccentric' | 'peak' | 'return' } {
  // rawPhase in [0, 1)
  if (rawPhase < 0.08) {
    return { t: 0, stage: 'start' };
  }
  if (rawPhase < 0.45) {
    const u = (rawPhase - 0.08) / 0.37;
    const eased = 0.5 - 0.5 * Math.cos(Math.PI * u);
    return { t: eased, stage: 'eccentric' };
  }
  if (rawPhase < 0.6) {
    return { t: 1, stage: 'peak' };
  }
  const u = (rawPhase - 0.6) / 0.4;
  const eased = 0.5 + 0.5 * Math.cos(Math.PI * u);
  return { t: eased, stage: 'return' };
}

const STAGE_TEXT: Record<'start' | 'eccentric' | 'peak' | 'return', { label: string; breath: string }> = {
  start: { label: 'Başlangıç Formu', breath: 'Hazırlan • Nefes Al' },
  eccentric: { label: 'Kontrollü Hareket', breath: 'Akışı Hisset' },
  peak: { label: 'Tepe Sıkıştırma (1 sn)', breath: 'Nefes Ver • Kasları Hisset' },
  return: { label: 'Yavaşça Dönüş', breath: 'Kontrollü Bırak • Nefes Al' },
};

// Joint styling constants (warm wellness palette)
const SKIN = '#F2CBB8';
const TOP_WEAR = '#7A9B85'; // sage athletic top
const LEGGING = '#C97B6C'; // dusty rose leggings
const HAIR = '#4A3B32';
const EQUIP = '#8A8177';
const EQUIP_LIGHT = '#D5CCC0';
const ACCENT_ARROW = '#D98A7C';

function renderScene(kind: AnimationKind, t: number): React.ReactNode {
  switch (kind) {
    case 'leg_press': {
      // Seated at 45° sled pushing platform diagonally up-right
      const push = t; // 0 = bent knees, 1 = extended
      const sledShift = lerp(0, 36, push);
      const kneeX = lerp(128, 152, push);
      const kneeY = lerp(95, 118, push);
      const footX = 166 + sledShift * 0.85;
      const footY = 104 - sledShift * 0.48;
      return (
        <g>
          {/* Machine frame */}
          <line x1="55" y1="168" x2="255" y2="168" stroke={EQUIP_LIGHT} strokeWidth="4" strokeLinecap="round" />
          <line x1="115" y1="168" x2="225" y2="70" stroke={EQUIP_LIGHT} strokeWidth="5" strokeLinecap="round" />
          {/* Backrest */}
          <line x1="65" y1="100" x2="105" y2="145" stroke={EQUIP} strokeWidth="10" strokeLinecap="round" />
          <line x1="100" y1="145" x2="132" y2="148" stroke={EQUIP} strokeWidth="10" strokeLinecap="round" />
          {/* Moving Foot Platform */}
          <g transform={`translate(${sledShift * 0.85}, ${-sledShift * 0.48})`}>
            <line x1="164" y1="74" x2="190" y2="122" stroke={EQUIP} strokeWidth="9" strokeLinecap="round" />
            <circle cx="195" cy="90" r="14" fill="#D98A7C" opacity="0.35" stroke={EQUIP} strokeWidth="2.5" />
          </g>
          {/* Person */}
          <circle cx="72" cy="92" r="11" fill={SKIN} />
          <circle cx="64" cy="87" r="6" fill={HAIR} />
          {/* Torso */}
          <line x1="79" y1="103" x2="112" y2="137" stroke={TOP_WEAR} strokeWidth="14" strokeLinecap="round" />
          {/* Arm holding handle */}
          <line x1="87" y1="112" x2="108" y2="142" stroke={SKIN} strokeWidth="6" strokeLinecap="round" />
          {/* Thigh & Shin */}
          <line x1="114" y1="138" x2={kneeX} y2={kneeY} stroke={LEGGING} strokeWidth="12" strokeLinecap="round" />
          <line x1={kneeX} y1={kneeY} x2={footX} y2={footY} stroke={LEGGING} strokeWidth="9.5" strokeLinecap="round" />
          {/* Shoe */}
          <line x1={footX} y1={footY} x2={footX + 8} y2={footY - 12} stroke="#2D2A26" strokeWidth="6" strokeLinecap="round" />
          {/* Motion Arrow */}
          <path d="M210 58 L234 44" stroke={ACCENT_ARROW} strokeWidth="2.5" strokeDasharray="4 3" markerEnd="url(#arrow)" />
        </g>
      );
    }

    case 'squat': {
      // Goblet Squat side-3/4 view
      const hipY = lerp(104, 134, t);
      const hipX = lerp(148, 126, t);
      const kneeX = lerp(150, 166, t);
      const kneeY = lerp(136, 136, t);
      const shoulderX = lerp(148, 142, t);
      const shoulderY = lerp(64, 92, t);
      return (
        <g>
          <line x1="65" y1="172" x2="235" y2="172" stroke={EQUIP_LIGHT} strokeWidth="3.5" strokeLinecap="round" />
          {/* Shadow */}
          <ellipse cx="148" cy="172" rx={lerp(24, 34, t)} ry="4" fill="#E6DDD0" />
          {/* Shin */}
          <line x1={kneeX} y1={kneeY} x2="148" y2="168" stroke={LEGGING} strokeWidth="9.5" strokeLinecap="round" />
          {/* Thigh */}
          <line x1={hipX} y1={hipY} x2={kneeX} y2={kneeY} stroke={LEGGING} strokeWidth="11.5" strokeLinecap="round" />
          {/* Torso */}
          <line x1={hipX} y1={hipY} x2={shoulderX} y2={shoulderY} stroke={TOP_WEAR} strokeWidth="14" strokeLinecap="round" />
          {/* Head */}
          <circle cx={shoulderX + 2} cy={shoulderY - 15} r="11" fill={SKIN} />
          <circle cx={shoulderX - 6} cy={shoulderY - 19} r="6.5" fill={HAIR} />
          {/* Arm holding dumbbell at chest */}
          <line x1={shoulderX + 3} y1={shoulderY + 5} x2={shoulderX + 19} y2={shoulderY + 18} stroke={SKIN} strokeWidth="6" strokeLinecap="round" />
          {/* Goblet Dumbbell */}
          <rect x={shoulderX + 16} y={shoulderY + 6} width="12" height="22" rx="3" fill={EQUIP} />
          {/* Shoe */}
          <line x1="145" y1="168" x2="162" y2="168" stroke="#2D2A26" strokeWidth="6" strokeLinecap="round" />
          {/* Muscle highlight pulse on glutes */}
          <circle cx={hipX - 4} cy={hipY + 2} r={lerp(6, 11, t)} fill="#D98A7C" opacity={lerp(0.15, 0.45, t)} />
        </g>
      );
    }

    case 'rdl': {
      // Dumbbell Romanian Deadlift (hip hinge)
      const hipX = lerp(146, 116, t);
      const hipY = lerp(102, 108, t);
      const shoulderX = lerp(146, 178, t);
      const shoulderY = lerp(60, 88, t);
      const handX = lerp(152, 166, t);
      const handY = lerp(102, 138, t);
      const kneeX = lerp(148, 144, t);
      return (
        <g>
          <line x1="65" y1="172" x2="235" y2="172" stroke={EQUIP_LIGHT} strokeWidth="3.5" strokeLinecap="round" />
          {/* Legs (slight soft knee) */}
          <line x1={kneeX} y1="138" x2="148" y2="168" stroke={LEGGING} strokeWidth="9.5" strokeLinecap="round" />
          <line x1={hipX} y1={hipY} x2={kneeX} y2="138" stroke={LEGGING} strokeWidth="11.5" strokeLinecap="round" />
          {/* Flat back torso */}
          <line x1={hipX} y1={hipY} x2={shoulderX} y2={shoulderY} stroke={TOP_WEAR} strokeWidth="14" strokeLinecap="round" />
          {/* Head inline with spine */}
          <circle cx={shoulderX + lerp(2, 14, t)} cy={shoulderY - lerp(15, 6, t)} r="10.5" fill={SKIN} />
          <circle cx={shoulderX - lerp(6, -6, t)} cy={shoulderY - lerp(19, 13, t)} r="6" fill={HAIR} />
          {/* Arms straight down close to legs */}
          <line x1={shoulderX} y1={shoulderY + 4} x2={handX} y2={handY} stroke={SKIN} strokeWidth="6" strokeLinecap="round" />
          {/* Dumbbell */}
          <rect x={handX - 9} y={handY - 4} width="18" height="8" rx="3" fill={EQUIP} />
          {/* Shoe */}
          <line x1="145" y1="168" x2="162" y2="168" stroke="#2D2A26" strokeWidth="6" strokeLinecap="round" />
          {/* Arrow showing hip hinge back */}
          <path d="M108 106 L86 106" stroke={ACCENT_ARROW} strokeWidth="2.5" strokeDasharray="3 3" />
          <circle cx={hipX - 2} cy={hipY + 12} r={lerp(6, 12, t)} fill="#D98A7C" opacity={lerp(0.15, 0.45, t)} />
        </g>
      );
    }

    case 'hip_thrust': {
      // Upper back on bench, hips driving up to horizontal bridge
      const hipY = lerp(154, 114, t);
      const shoulderY = lerp(114, 112, t);
      return (
        <g>
          <line x1="45" y1="172" x2="255" y2="172" stroke={EQUIP_LIGHT} strokeWidth="3.5" strokeLinecap="round" />
          {/* Bench */}
          <rect x="65" y="114" width="44" height="58" rx="6" fill={EQUIP_LIGHT} stroke={EQUIP} strokeWidth="2" />
          {/* Shin vertical at top */}
          <line x1="192" y1="116" x2="194" y2="168" stroke={LEGGING} strokeWidth="9.5" strokeLinecap="round" />
          {/* Thigh */}
          <line x1="148" y1={hipY} x2="192" y2="116" stroke={LEGGING} strokeWidth="11.5" strokeLinecap="round" />
          {/* Torso */}
          <line x1="106" y1={shoulderY} x2="148" y2={hipY} stroke={TOP_WEAR} strokeWidth="14" strokeLinecap="round" />
          {/* Head (chin tucked, looking forward) */}
          <circle cx="96" cy={shoulderY - 12} r="10.5" fill={SKIN} />
          <circle cx="88" cy={shoulderY - 14} r="6" fill={HAIR} />
          {/* Hands holding dumbbell on hips */}
          <line x1="112" y1={shoulderY + 4} x2="146" y2={hipY - 4} stroke={SKIN} strokeWidth="5.5" strokeLinecap="round" />
          {/* Dumbbell on hip */}
          <rect x="139" y={hipY - 14} width="16" height="10" rx="3.5" fill={EQUIP} />
          {/* Shoe */}
          <line x1="191" y1="168" x2="209" y2="168" stroke="#2D2A26" strokeWidth="6" strokeLinecap="round" />
          {/* Glute activation glow */}
          <circle cx="148" cy={hipY + 5} r={lerp(6, 13, t)} fill="#D98A7C" opacity={lerp(0.15, 0.5, t)} />
        </g>
      );
    }

    case 'leg_extension': {
      // Seated on machine, extending lower legs from 90° to straight
      const angleRad = lerp(Math.PI * 0.48, Math.PI * 0.04, t);
      const kneeX = 148;
      const kneeY = 114;
      const ankleX = kneeX + Math.cos(angleRad) * 44;
      const ankleY = kneeY + Math.sin(angleRad) * 44;
      return (
        <g>
          <line x1="55" y1="172" x2="245" y2="172" stroke={EQUIP_LIGHT} strokeWidth="3.5" strokeLinecap="round" />
          {/* Machine chair */}
          <rect x="92" y="70" width="12" height="58" rx="5" fill={EQUIP} />
          <rect x="96" y="118" width="54" height="12" rx="5" fill={EQUIP} />
          <line x1="120" y1="130" x2="120" y2="172" stroke={EQUIP_LIGHT} strokeWidth="7" />
          {/* Machine lever arm */}
          <line x1={kneeX} y1={kneeY + 4} x2={ankleX} y2={ankleY} stroke={EQUIP_LIGHT} strokeWidth="4" />
          {/* Person */}
          <circle cx="112" cy="64" r="10.5" fill={SKIN} />
          <circle cx="104" cy="60" r="6" fill={HAIR} />
          <line x1="112" y1="76" x2="112" y2="114" stroke={TOP_WEAR} strokeWidth="14" strokeLinecap="round" />
          <line x1="112" y1="88" x2="128" y2="120" stroke={SKIN} strokeWidth="5.5" strokeLinecap="round" />
          {/* Thigh */}
          <line x1="114" y1="114" x2={kneeX} y2={kneeY} stroke={LEGGING} strokeWidth="12" strokeLinecap="round" />
          {/* Lower leg extending */}
          <line x1={kneeX} y1={kneeY} x2={ankleX} y2={ankleY} stroke={LEGGING} strokeWidth="9.5" strokeLinecap="round" />
          {/* Ankle roller pad */}
          <circle cx={ankleX + 4} cy={ankleY - 3} r="6.5" fill={EQUIP} />
          <circle cx="132" cy="110" r={lerp(5, 11, t)} fill="#D98A7C" opacity={lerp(0.15, 0.45, t)} />
        </g>
      );
    }

    case 'leg_curl': {
      // Seated leg curl: legs start extended forward, curl down & back
      const angleRad = lerp(Math.PI * 0.08, Math.PI * 0.62, t);
      const kneeX = 152;
      const kneeY = 114;
      const ankleX = kneeX + Math.cos(angleRad) * 44;
      const ankleY = kneeY + Math.sin(angleRad) * 44;
      return (
        <g>
          <line x1="55" y1="172" x2="245" y2="172" stroke={EQUIP_LIGHT} strokeWidth="3.5" strokeLinecap="round" />
          <rect x="92" y="70" width="12" height="58" rx="5" fill={EQUIP} />
          <rect x="96" y="118" width="56" height="12" rx="5" fill={EQUIP} />
          <line x1="120" y1="130" x2="120" y2="172" stroke={EQUIP_LIGHT} strokeWidth="7" />
          {/* Person */}
          <circle cx="112" cy="64" r="10.5" fill={SKIN} />
          <circle cx="104" cy="60" r="6" fill={HAIR} />
          <line x1="112" y1="76" x2="112" y2="114" stroke={TOP_WEAR} strokeWidth="14" strokeLinecap="round" />
          {/* Thigh locked under top pad */}
          <line x1="114" y1="114" x2={kneeX} y2={kneeY} stroke={LEGGING} strokeWidth="12" strokeLinecap="round" />
          <circle cx="142" cy="103" r="6" fill={EQUIP} />
          {/* Lower leg curling under */}
          <line x1={kneeX} y1={kneeY} x2={ankleX} y2={ankleY} stroke={LEGGING} strokeWidth="9.5" strokeLinecap="round" />
          <circle cx={ankleX - 3} cy={ankleY + 5} r="6.5" fill={EQUIP} />
          <circle cx="134" cy="120" r={lerp(5, 11, t)} fill="#D98A7C" opacity={lerp(0.15, 0.45, t)} />
        </g>
      );
    }

    case 'hip_abduction': {
      // Front-view seated hip abduction: knees pushing outward symmetrically
      const spread = lerp(16, 46, t);
      return (
        <g>
          <line x1="55" y1="172" x2="245" y2="172" stroke={EQUIP_LIGHT} strokeWidth="3.5" strokeLinecap="round" />
          {/* Seat */}
          <rect x="118" y="116" width="64" height="12" rx="5" fill={EQUIP} />
          <rect x="128" y="64" width="44" height="52" rx="10" fill={EQUIP_LIGHT} />
          {/* Person Front View */}
          <circle cx="150" cy="54" r="11" fill={SKIN} />
          <path d="M139 50 Q150 38 161 50" stroke={HAIR} strokeWidth="6" fill="none" strokeLinecap="round" />
          <rect x="136" y="68" width="28" height="44" rx="10" fill={TOP_WEAR} />
          {/* Thighs opening out */}
          <line x1="142" y1="112" x2={150 - spread} y2="132" stroke={LEGGING} strokeWidth="12" strokeLinecap="round" />
          <line x1="158" y1="112" x2={150 + spread} y2="132" stroke={LEGGING} strokeWidth="12" strokeLinecap="round" />
          {/* Shins */}
          <line x1={150 - spread} y1="132" x2={150 - spread * 0.85} y2="164" stroke={LEGGING} strokeWidth="9" strokeLinecap="round" />
          <line x1={150 + spread} y1="132" x2={150 + spread * 0.85} y2="164" stroke={LEGGING} strokeWidth="9" strokeLinecap="round" />
          {/* Outer pads */}
          <rect x={150 - spread - 12} y="120" width="8" height="22" rx="4" fill={EQUIP} />
          <rect x={150 + spread + 4} y="120" width="8" height="22" rx="4" fill={EQUIP} />
          {/* Outward arrows */}
          <line x1="110" y1="132" x2="88" y2="132" stroke={ACCENT_ARROW} strokeWidth="2.5" strokeDasharray="3 3" />
          <line x1="190" y1="132" x2="212" y2="132" stroke={ACCENT_ARROW} strokeWidth="2.5" strokeDasharray="3 3" />
        </g>
      );
    }

    case 'lunge': {
      // Reverse lunge
      const hipY = lerp(102, 126, t);
      const backFootX = lerp(146, 102, t);
      const backKneeX = lerp(148, 122, t);
      const backKneeY = lerp(136, 158, t);
      const frontKneeX = lerp(152, 174, t);
      const frontKneeY = lerp(136, 134, t);
      const shoulderY = lerp(60, 84, t);
      return (
        <g>
          <line x1="55" y1="172" x2="245" y2="172" stroke={EQUIP_LIGHT} strokeWidth="3.5" strokeLinecap="round" />
          {/* Back leg */}
          <line x1="146" y1={hipY} x2={backKneeX} y2={backKneeY} stroke="#B86B5D" strokeWidth="10.5" strokeLinecap="round" />
          <line x1={backKneeX} y1={backKneeY} x2={backFootX} y2="168" stroke="#B86B5D" strokeWidth="8.5" strokeLinecap="round" />
          {/* Front leg */}
          <line x1="148" y1={hipY} x2={frontKneeX} y2={frontKneeY} stroke={LEGGING} strokeWidth="11.5" strokeLinecap="round" />
          <line x1={frontKneeX} y1={frontKneeY} x2="174" y2="168" stroke={LEGGING} strokeWidth="9.5" strokeLinecap="round" />
          {/* Torso */}
          <line x1="148" y1={hipY} x2="152" y2={shoulderY} stroke={TOP_WEAR} strokeWidth="14" strokeLinecap="round" />
          <circle cx="153" cy={shoulderY - 15} r="10.5" fill={SKIN} />
          <circle cx="145" cy={shoulderY - 19} r="6" fill={HAIR} />
          {/* Arm with dumbbell */}
          <line x1="152" y1={shoulderY + 5} x2="152" y2={shoulderY + 42} stroke={SKIN} strokeWidth="6" strokeLinecap="round" />
          <rect x="145" y={shoulderY + 39} width="14" height="7" rx="3" fill={EQUIP} />
          {/* Shoes */}
          <line x1="171" y1="168" x2="188" y2="168" stroke="#2D2A26" strokeWidth="6" strokeLinecap="round" />
        </g>
      );
    }

    case 'cable_kickback': {
      // Facing cable column on left, kicking right leg backward
      const footX = lerp(164, 224, t);
      const footY = lerp(165, 134, t);
      return (
        <g>
          <line x1="45" y1="172" x2="255" y2="172" stroke={EQUIP_LIGHT} strokeWidth="3.5" strokeLinecap="round" />
          {/* Cable post on left */}
          <rect x="66" y="34" width="12" height="138" rx="4" fill={EQUIP} />
          <circle cx="78" cy="162" r="5" fill={EQUIP_LIGHT} />
          {/* Cable line */}
          <line x1="78" y1="162" x2={footX} y2={footY} stroke="#6E685F" strokeWidth="2" strokeDasharray="3 2" />
          {/* Standing leg */}
          <line x1="156" y1="106" x2="152" y2="168" stroke="#B86B5D" strokeWidth="10" strokeLinecap="round" />
          {/* Kicking leg */}
          <line x1="158" y1="106" x2={footX} y2={footY} stroke={LEGGING} strokeWidth="10.5" strokeLinecap="round" />
          {/* Ankle cuff */}
          <circle cx={footX} cy={footY} r="5.5" fill={EQUIP} />
          {/* Leaning torso */}
          <line x1="156" y1="106" x2="122" y2="76" stroke={TOP_WEAR} strokeWidth="14" strokeLinecap="round" />
          <circle cx="112" cy="67" r="10" fill={SKIN} />
          <circle cx="118" cy="60" r="6" fill={HAIR} />
          {/* Arms holding column */}
          <line x1="122" y1="78" x2="78" y2="86" stroke={SKIN} strokeWidth="6" strokeLinecap="round" />
          <circle cx="162" cy="105" r={lerp(6, 13, t)} fill="#D98A7C" opacity={lerp(0.15, 0.5, t)} />
        </g>
      );
    }

    case 'lat_pulldown': {
      // Front-view seated pulling wide bar down to upper chest
      const barY = lerp(34, 84, t);
      const elbowY = lerp(56, 100, t);
      const elbowSpread = lerp(36, 48, t);
      return (
        <g>
          {/* Machine overhead cable */}
          <line x1="150" y1="12" x2="150" y2={barY} stroke="#6E685F" strokeWidth="2.5" />
          <rect x="135" y="10" width="30" height="8" rx="3" fill={EQUIP} />
          {/* Seat */}
          <rect x="122" y="138" width="56" height="10" rx="5" fill={EQUIP} />
          {/* Thighs & knee pad */}
          <rect x="128" y="128" width="44" height="10" rx="5" fill={LEGGING} />
          <rect x="122" y="122" width="56" height="6" rx="3" fill={EQUIP_LIGHT} />
          {/* Torso */}
          <rect x="134" y="78" width="32" height="52" rx="11" fill={TOP_WEAR} />
          {/* Head */}
          <circle cx="150" cy="64" r="11" fill={SKIN} />
          <path d="M139 60 Q150 48 161 60" stroke={HAIR} strokeWidth="6" fill="none" strokeLinecap="round" />
          {/* Upper arms & Forearms */}
          <line x1="136" y1="84" x2={150 - elbowSpread} y2={elbowY} stroke={SKIN} strokeWidth="7" strokeLinecap="round" />
          <line x1={150 - elbowSpread} y1={elbowY} x2="104" y2={barY} stroke={SKIN} strokeWidth="6" strokeLinecap="round" />
          <line x1="164" y1="84" x2={150 + elbowSpread} y2={elbowY} stroke={SKIN} strokeWidth="7" strokeLinecap="round" />
          <line x1={150 + elbowSpread} y1={elbowY} x2="196" y2={barY} stroke={SKIN} strokeWidth="6" strokeLinecap="round" />
          {/* Lat Pulldown Bar */}
          <path d={`M92 ${barY + 6} L106 ${barY} L194 ${barY} L208 ${barY + 6}`} stroke={EQUIP} strokeWidth="5.5" fill="none" strokeLinecap="round" />
          {/* Lat highlight */}
          <ellipse cx="136" cy="102" rx="6" ry="12" fill="#D98A7C" opacity={lerp(0.1, 0.5, t)} />
          <ellipse cx="164" cy="102" rx="6" ry="12" fill="#D98A7C" opacity={lerp(0.1, 0.5, t)} />
        </g>
      );
    }

    case 'seated_row': {
      // Side view seated cable row
      const handX = lerp(116, 162, t);
      const elbowX = lerp(138, 198, t);
      return (
        <g>
          <line x1="45" y1="172" x2="255" y2="172" stroke={EQUIP_LIGHT} strokeWidth="3.5" strokeLinecap="round" />
          {/* Cable stack left */}
          <rect x="52" y="54" width="14" height="118" rx="4" fill={EQUIP} />
          {/* Bench */}
          <rect x="128" y="138" width="76" height="12" rx="5" fill={EQUIP} />
          <line x1="165" y1="150" x2="165" y2="172" stroke={EQUIP_LIGHT} strokeWidth="7" />
          {/* Footplate */}
          <line x1="94" y1="118" x2="104" y2="148" stroke={EQUIP} strokeWidth="6" strokeLinecap="round" />
          {/* Cable */}
          <line x1="66" y1="112" x2={handX} y2="112" stroke="#6E685F" strokeWidth="2.5" />
          {/* Legs */}
          <line x1="168" y1="132" x2="128" y2="126" stroke={LEGGING} strokeWidth="11.5" strokeLinecap="round" />
          <line x1="128" y1="126" x2="100" y2="132" stroke={LEGGING} strokeWidth="9" strokeLinecap="round" />
          {/* Upright Torso */}
          <line x1="170" y1="132" x2="172" y2="82" stroke={TOP_WEAR} strokeWidth="14" strokeLinecap="round" />
          <circle cx="170" cy="66" r="10.5" fill={SKIN} />
          <circle cx="178" cy="62" r="6" fill={HAIR} />
          {/* Rowing Arm */}
          <line x1="170" y1="90" x2={elbowX} y2="114" stroke={SKIN} strokeWidth="6.5" strokeLinecap="round" />
          <line x1={elbowX} y1="114" x2={handX} y2="112" stroke={SKIN} strokeWidth="6" strokeLinecap="round" />
          {/* Handle */}
          <circle cx={handX} cy="112" r="5" fill={EQUIP} />
          <circle cx="176" cy="96" r={lerp(5, 11, t)} fill="#D98A7C" opacity={lerp(0.15, 0.5, t)} />
        </g>
      );
    }

    case 'face_pull': {
      // Standing pulling rope toward face/forehead
      const handX = lerp(124, 174, t);
      const handY = lerp(80, 64, t);
      const elbowX = lerp(148, 202, t);
      const elbowY = lerp(86, 74, t);
      return (
        <g>
          <line x1="45" y1="172" x2="255" y2="172" stroke={EQUIP_LIGHT} strokeWidth="3.5" strokeLinecap="round" />
          {/* Cable post left */}
          <rect x="56" y="34" width="12" height="138" rx="4" fill={EQUIP} />
          <line x1="68" y1="74" x2={handX} y2={handY} stroke="#6E685F" strokeWidth="2.5" />
          {/* Legs */}
          <line x1="178" y1="116" x2="164" y2="168" stroke={LEGGING} strokeWidth="10" strokeLinecap="round" />
          <line x1="184" y1="116" x2="196" y2="168" stroke="#B86B5D" strokeWidth="10" strokeLinecap="round" />
          {/* Torso */}
          <line x1="180" y1="116" x2="182" y2="74" stroke={TOP_WEAR} strokeWidth="14" strokeLinecap="round" />
          <circle cx="180" cy="58" r="10.5" fill={SKIN} />
          <circle cx="189" cy="54" r="6" fill={HAIR} />
          {/* Arm pulling high */}
          <line x1="182" y1="78" x2={elbowX} y2={elbowY} stroke={SKIN} strokeWidth="6.5" strokeLinecap="round" />
          <line x1={elbowX} y1={elbowY} x2={handX} y2={handY} stroke={SKIN} strokeWidth="6" strokeLinecap="round" />
          <circle cx={handX} cy={handY} r="4.5" fill={EQUIP} />
          <circle cx="186" cy="76" r={lerp(5, 11, t)} fill="#D98A7C" opacity={lerp(0.15, 0.5, t)} />
        </g>
      );
    }

    case 'chest_press': {
      // Seated pressing machine handles forward
      const handX = lerp(136, 178, t);
      const elbowX = lerp(104, 152, t);
      return (
        <g>
          <line x1="55" y1="172" x2="245" y2="172" stroke={EQUIP_LIGHT} strokeWidth="3.5" strokeLinecap="round" />
          {/* Chair */}
          <rect x="100" y="64" width="12" height="62" rx="5" fill={EQUIP} />
          <rect x="104" y="118" width="46" height="12" rx="5" fill={EQUIP} />
          <line x1="122" y1="130" x2="122" y2="172" stroke={EQUIP_LIGHT} strokeWidth="7" />
          {/* Machine lever */}
          <line x1="144" y1="40" x2={handX} y2="92" stroke={EQUIP_LIGHT} strokeWidth="5" strokeLinecap="round" />
          {/* Person */}
          <circle cx="120" cy="60" r="10.5" fill={SKIN} />
          <circle cx="112" cy="56" r="6" fill={HAIR} />
          <line x1="120" y1="74" x2="120" y2="114" stroke={TOP_WEAR} strokeWidth="14" strokeLinecap="round" />
          <line x1="122" y1="114" x2="154" y2="118" stroke={LEGGING} strokeWidth="11" strokeLinecap="round" />
          <line x1="154" y1="118" x2="154" y2="166" stroke={LEGGING} strokeWidth="9" strokeLinecap="round" />
          {/* Pressing arm */}
          <line x1="122" y1="84" x2={elbowX} y2="96" stroke={SKIN} strokeWidth="6.5" strokeLinecap="round" />
          <line x1={elbowX} y1="96" x2={handX} y2="92" stroke={SKIN} strokeWidth="6" strokeLinecap="round" />
          <circle cx={handX} cy="92" r="5" fill={EQUIP} />
          <circle cx="128" cy="86" r={lerp(5, 11, t)} fill="#D98A7C" opacity={lerp(0.15, 0.45, t)} />
        </g>
      );
    }

    case 'shoulder_press': {
      // Front-view seated pressing dumbbells overhead
      const handY = lerp(74, 34, t);
      const handXOff = lerp(34, 22, t);
      const elbowY = lerp(96, 60, t);
      const elbowXOff = lerp(42, 30, t);
      return (
        <g>
          {/* Bench backrest */}
          <rect x="130" y="66" width="40" height="62" rx="10" fill={EQUIP_LIGHT} />
          <rect x="122" y="128" width="56" height="10" rx="5" fill={EQUIP} />
          {/* Legs */}
          <line x1="138" y1="136" x2="132" y2="168" stroke={LEGGING} strokeWidth="10" strokeLinecap="round" />
          <line x1="162" y1="136" x2="168" y2="168" stroke={LEGGING} strokeWidth="10" strokeLinecap="round" />
          {/* Torso */}
          <rect x="135" y="76" width="30" height="52" rx="10" fill={TOP_WEAR} />
          <circle cx="150" cy="60" r="11" fill={SKIN} />
          <path d="M139 56 Q150 44 161 56" stroke={HAIR} strokeWidth="6" fill="none" strokeLinecap="round" />
          {/* Left & Right Arms */}
          <line x1="136" y1="84" x2={150 - elbowXOff} y2={elbowY} stroke={SKIN} strokeWidth="6.5" strokeLinecap="round" />
          <line x1={150 - elbowXOff} y1={elbowY} x2={150 - handXOff} y2={handY} stroke={SKIN} strokeWidth="6" strokeLinecap="round" />
          <line x1="164" y1="84" x2={150 + elbowXOff} y2={elbowY} stroke={SKIN} strokeWidth="6.5" strokeLinecap="round" />
          <line x1={150 + elbowXOff} y1={elbowY} x2={150 + handXOff} y2={handY} stroke={SKIN} strokeWidth="6" strokeLinecap="round" />
          {/* Dumbbells */}
          <rect x={150 - handXOff - 10} y={handY - 4} width="20" height="8" rx="3" fill={EQUIP} />
          <rect x={150 + handXOff - 10} y={handY - 4} width="20" height="8" rx="3" fill={EQUIP} />
          {/* Shoulder glow */}
          <circle cx="134" cy="82" r={lerp(4, 8, t)} fill="#D98A7C" opacity={lerp(0.15, 0.5, t)} />
          <circle cx="166" cy="82" r={lerp(4, 8, t)} fill="#D98A7C" opacity={lerp(0.15, 0.5, t)} />
        </g>
      );
    }

    case 'lateral_raise': {
      // Front-view standing raising arms to T-shape
      const armAngle = lerp(Math.PI * 0.44, 0.04, t);
      const armLen = 46;
      const dx = Math.cos(armAngle) * armLen;
      const dy = Math.sin(armAngle) * armLen;
      return (
        <g>
          <line x1="55" y1="172" x2="245" y2="172" stroke={EQUIP_LIGHT} strokeWidth="3.5" strokeLinecap="round" />
          {/* Legs */}
          <line x1="142" y1="112" x2="138" y2="168" stroke={LEGGING} strokeWidth="10.5" strokeLinecap="round" />
          <line x1="158" y1="112" x2="162" y2="168" stroke={LEGGING} strokeWidth="10.5" strokeLinecap="round" />
          {/* Torso */}
          <rect x="135" y="64" width="30" height="48" rx="10" fill={TOP_WEAR} />
          <circle cx="150" cy="48" r="11" fill={SKIN} />
          <path d="M139 44 Q150 32 161 44" stroke={HAIR} strokeWidth="6" fill="none" strokeLinecap="round" />
          {/* Raising arms */}
          <line x1="136" y1="72" x2={136 - dx} y2={72 + dy} stroke={SKIN} strokeWidth="6.5" strokeLinecap="round" />
          <line x1="164" y1="72" x2={164 + dx} y2={72 + dy} stroke={SKIN} strokeWidth="6.5" strokeLinecap="round" />
          {/* Dumbbells */}
          <rect x={136 - dx - 7} y={72 + dy - 4} width="14" height="8" rx="3" fill={EQUIP} />
          <rect x={164 + dx - 7} y={72 + dy - 4} width="14" height="8" rx="3" fill={EQUIP} />
          <circle cx="134" cy="72" r={lerp(4, 9, t)} fill="#D98A7C" opacity={lerp(0.15, 0.5, t)} />
          <circle cx="166" cy="72" r={lerp(4, 9, t)} fill="#D98A7C" opacity={lerp(0.15, 0.5, t)} />
        </g>
      );
    }

    case 'triceps_pushdown': {
      // Standing facing cable column on left, elbows pinned, pushing rope down
      const handX = lerp(124, 144, t);
      const handY = lerp(86, 124, t);
      return (
        <g>
          <line x1="45" y1="172" x2="255" y2="172" stroke={EQUIP_LIGHT} strokeWidth="3.5" strokeLinecap="round" />
          <rect x="76" y="24" width="12" height="148" rx="4" fill={EQUIP} />
          {/* High cable */}
          <line x1="88" y1="30" x2={handX} y2={handY} stroke="#6E685F" strokeWidth="2.5" />
          {/* Person */}
          <line x1="158" y1="112" x2="156" y2="168" stroke={LEGGING} strokeWidth="11" strokeLinecap="round" />
          <line x1="158" y1="112" x2="154" y2="66" stroke={TOP_WEAR} strokeWidth="14" strokeLinecap="round" />
          <circle cx="152" cy="50" r="10.5" fill={SKIN} />
          <circle cx="161" cy="46" r="6" fill={HAIR} />
          {/* Pinned upper arm */}
          <line x1="154" y1="72" x2="152" y2="96" stroke={SKIN} strokeWidth="7" strokeLinecap="round" />
          {/* Forearm hinging down */}
          <line x1="152" y1="96" x2={handX} y2={handY} stroke={SKIN} strokeWidth="6" strokeLinecap="round" />
          <circle cx={handX} cy={handY} r="4.5" fill={EQUIP} />
          <circle cx="157" cy="86" r={lerp(4, 9, t)} fill="#D98A7C" opacity={lerp(0.15, 0.5, t)} />
        </g>
      );
    }

    case 'bicep_curl': {
      // Side view standing bicep curl
      const forearmAngle = lerp(Math.PI * 0.45, -Math.PI * 0.35, t);
      const elbowX = 152;
      const elbowY = 98;
      const handX = elbowX + Math.cos(forearmAngle) * 28;
      const handY = elbowY + Math.sin(forearmAngle) * 28;
      return (
        <g>
          <line x1="55" y1="172" x2="245" y2="172" stroke={EQUIP_LIGHT} strokeWidth="3.5" strokeLinecap="round" />
          <line x1="150" y1="112" x2="150" y2="168" stroke={LEGGING} strokeWidth="11.5" strokeLinecap="round" />
          <line x1="150" y1="112" x2="150" y2="66" stroke={TOP_WEAR} strokeWidth="14" strokeLinecap="round" />
          <circle cx="152" cy="50" r="10.5" fill={SKIN} />
          <circle cx="144" cy="46" r="6" fill={HAIR} />
          {/* Upper arm pinned */}
          <line x1="152" y1="72" x2={elbowX} y2={elbowY} stroke={SKIN} strokeWidth="7" strokeLinecap="round" />
          {/* Forearm curling up */}
          <line x1={elbowX} y1={elbowY} x2={handX} y2={handY} stroke={SKIN} strokeWidth="6" strokeLinecap="round" />
          <rect x={handX - 7} y={handY - 4} width="14" height="8" rx="3" fill={EQUIP} />
          <circle cx="156" cy="84" r={lerp(4, 9, t)} fill="#D98A7C" opacity={lerp(0.15, 0.5, t)} />
        </g>
      );
    }

    case 'plank': {
      // Forearm plank with gentle core engagement breathing pulse
      const breathe = lerp(0, -2.5, t);
      return (
        <g>
          {/* Yoga mat */}
          <rect x="46" y="154" width="208" height="8" rx="4" fill="#E2ECE5" stroke="#87A892" strokeWidth="1.5" />
          {/* Straight body line */}
          <line x1="94" y1={118 + breathe} x2="158" y2={122 + breathe} stroke={TOP_WEAR} strokeWidth="14" strokeLinecap="round" />
          <line x1="158" y1={122 + breathe} x2="226" y2="148" stroke={LEGGING} strokeWidth="11" strokeLinecap="round" />
          {/* Head */}
          <circle cx="78" cy={112 + breathe} r="10.5" fill={SKIN} />
          <circle cx="78" cy={104 + breathe} r="5.5" fill={HAIR} />
          {/* Forearm support */}
          <line x1="96" y1={122 + breathe} x2="94" y2="150" stroke={SKIN} strokeWidth="6.5" strokeLinecap="round" />
          <line x1="94" y1="150" x2="72" y2="150" stroke={SKIN} strokeWidth="6" strokeLinecap="round" />
          {/* Core engagement aura */}
          <ellipse cx="142" cy={124 + breathe} rx={lerp(14, 22, t)} ry={lerp(6, 10, t)} fill="#D98A7C" opacity={lerp(0.18, 0.45, t)} />
          {/* Alignment dashed line */}
          <line x1="88" y1="104" x2="228" y2="138" stroke="#87A892" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
        </g>
      );
    }

    case 'dead_bug': {
      // Lying supine, extending opposite arm back and leg forward
      const armX = lerp(114, 62, t);
      const armY = lerp(104, 140, t);
      const footX = lerp(196, 238, t);
      const footY = lerp(112, 138, t);
      const kneeX = lerp(164, 200, t);
      const kneeY = lerp(112, 138, t);
      return (
        <g>
          <rect x="44" y="152" width="212" height="8" rx="4" fill="#E2ECE5" stroke="#87A892" strokeWidth="1.5" />
          {/* Static opposite arm & leg */}
          <line x1="112" y1="142" x2="112" y2="104" stroke="#E5B7A1" strokeWidth="5.5" strokeLinecap="round" />
          <line x1="162" y1="142" x2="162" y2="114" stroke="#B86B5D" strokeWidth="10" strokeLinecap="round" />
          <line x1="162" y1="114" x2="194" y2="114" stroke="#B86B5D" strokeWidth="8.5" strokeLinecap="round" />
          {/* Torso flat on mat */}
          <line x1="106" y1="144" x2="164" y2="144" stroke={TOP_WEAR} strokeWidth="13" strokeLinecap="round" />
          <circle cx="90" cy="140" r="10" fill={SKIN} />
          <circle cx="82" cy="144" r="5.5" fill={HAIR} />
          {/* Moving arm */}
          <line x1="114" y1="142" x2={armX} y2={armY} stroke={SKIN} strokeWidth="6" strokeLinecap="round" />
          {/* Moving leg */}
          <line x1="164" y1="144" x2={kneeX} y2={kneeY} stroke={LEGGING} strokeWidth="10.5" strokeLinecap="round" />
          <line x1={kneeX} y1={kneeY} x2={footX} y2={footY} stroke={LEGGING} strokeWidth="9" strokeLinecap="round" />
          {/* Core stability highlight */}
          <ellipse cx="142" cy="142" rx="14" ry="7" fill="#D98A7C" opacity={lerp(0.2, 0.5, t)} />
        </g>
      );
    }

    case 'bird_dog': {
      // Tabletop position extending opposite arm & leg horizontally
      const handX = lerp(112, 62, t);
      const handY = lerp(148, 104, t);
      const footX = lerp(176, 236, t);
      const footY = lerp(148, 108, t);
      return (
        <g>
          <rect x="44" y="152" width="212" height="8" rx="4" fill="#E2ECE5" stroke="#87A892" strokeWidth="1.5" />
          {/* Support arm & leg */}
          <line x1="116" y1="110" x2="116" y2="149" stroke="#E5B7A1" strokeWidth="6" strokeLinecap="round" />
          <line x1="176" y1="112" x2="176" y2="149" stroke="#B86B5D" strokeWidth="10" strokeLinecap="round" />
          <line x1="176" y1="149" x2="202" y2="149" stroke="#B86B5D" strokeWidth="8" strokeLinecap="round" />
          {/* Flat back */}
          <line x1="114" y1="108" x2="178" y2="110" stroke={TOP_WEAR} strokeWidth="13.5" strokeLinecap="round" />
          <circle cx="98" cy="102" r="10" fill={SKIN} />
          <circle cx="102" cy="94" r="5.5" fill={HAIR} />
          {/* Extending arm & leg */}
          <line x1="114" y1="108" x2={handX} y2={handY} stroke={SKIN} strokeWidth="6" strokeLinecap="round" />
          <line x1="178" y1="110" x2={footX} y2={footY} stroke={LEGGING} strokeWidth="10.5" strokeLinecap="round" />
          <circle cx="148" cy="110" r={lerp(5, 11, t)} fill="#D98A7C" opacity={lerp(0.15, 0.45, t)} />
        </g>
      );
    }

    case 'incline_walk': {
      // Walking briskly up an inclined treadmill
      const stride = Math.sin(t * Math.PI * 2);
      const leg1X = 148 + stride * 18;
      const leg2X = 148 - stride * 18;
      const arm1X = 144 - stride * 14;
      const arm2X = 144 + stride * 14;
      return (
        <g>
          {/* Inclined Treadmill deck */}
          <line x1="72" y1="168" x2="226" y2="142" stroke={EQUIP} strokeWidth="10" strokeLinecap="round" />
          <line x1="202" y1="146" x2="212" y2="82" stroke={EQUIP} strokeWidth="6" strokeLinecap="round" />
          <rect x="200" y="72" width="26" height="12" rx="4" fill={EQUIP_LIGHT} stroke={EQUIP} strokeWidth="2" />
          {/* Back leg */}
          <line x1="146" y1="108" x2={leg2X} y2={152 - (leg2X - 148) * 0.17} stroke="#B86B5D" strokeWidth="10" strokeLinecap="round" />
          {/* Front leg */}
          <line x1="146" y1="108" x2={leg1X} y2={152 - (leg1X - 148) * 0.17} stroke={LEGGING} strokeWidth="10.5" strokeLinecap="round" />
          {/* Upright walking torso */}
          <line x1="146" y1="108" x2="152" y2="64" stroke={TOP_WEAR} strokeWidth="14" strokeLinecap="round" />
          <circle cx="154" cy="48" r="10.5" fill={SKIN} />
          <circle cx="145" cy="44" r="6" fill={HAIR} />
          {/* Swinging arms */}
          <line x1="150" y1="72" x2={arm2X} y2="100" stroke="#E5B7A1" strokeWidth="5.5" strokeLinecap="round" />
          <line x1="150" y1="72" x2={arm1X} y2="100" stroke={SKIN} strokeWidth="6" strokeLinecap="round" />
          {/* Incline indicator */}
          <text x="86" y="144" fontSize="11" fill="#6B8F78" fontWeight="600">
            %6-8 Eğim
          </text>
        </g>
      );
    }
  }
}

export const ExerciseAnimation: React.FC<ExerciseAnimationProps> = ({
  kind,
  tempo,
  compact = false,
}) => {
  const [playing, setPlaying] = useState(true);
  const [slowMo, setSlowMo] = useState(false);
  const [phase, setPhase] = useState(0);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!playing) {
      lastTimeRef.current = null;
      return;
    }

    const cycleMs = slowMo ? 6400 : 3400;

    const tick = (now: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = now;
      }
      const delta = now - lastTimeRef.current;
      lastTimeRef.current = now;
      setPhase((prev) => (prev + delta / cycleMs) % 1);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [playing, slowMo]);

  const { t, stage } = smoothCycle(phase);
  const stageMeta = STAGE_TEXT[stage];

  return (
    <div
      className={`rounded-2xl bg-gradient-to-b from-[#F7F3EC] to-[#EFE8DD] border border-[#E6DDD0] overflow-hidden ${
        compact ? 'p-3' : 'p-4'
      }`}
    >
      {/* Top phase bar */}
      {!compact && (
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 text-[#2D2A26] shadow-xs">
              <span
                className={`w-2 h-2 rounded-full ${
                  stage === 'peak' ? 'bg-[#D98A7C]' : 'bg-[#6B8F78]'
                }`}
              />
              {stageMeta.label}
            </span>
          </div>
          <span className="text-xs font-medium text-[#547460] bg-[#E2ECE5] px-2.5 py-1 rounded-full">
            {stageMeta.breath}
          </span>
        </div>
      )}

      {/* Animated SVG Canvas */}
      <div className="relative flex items-center justify-center">
        <svg
          viewBox="0 0 300 185"
          className={`w-full ${compact ? 'max-h-36' : 'max-h-56'} select-none`}
          role="img"
          aria-label="Hareket form animasyonu"
        >
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill={ACCENT_ARROW} />
            </marker>
          </defs>
          {/* Subtle studio backdrop circle */}
          <circle cx="150" cy="96" r="76" fill="#FAF7F2" opacity="0.72" />
          {renderScene(kind, t)}
        </svg>
      </div>

      {/* Controls & Tempo */}
      {!compact && (
        <div className="mt-2 pt-3 border-t border-[#E6DDD0]/80 flex flex-col gap-2.5">
          {/* Interactive scrubber */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              className="w-8 h-8 rounded-full bg-white text-[#2D2A26] hover:bg-[#E2ECE5] flex items-center justify-center shadow-xs transition cursor-pointer"
              title={playing ? 'Duraklat' : 'Oynat'}
            >
              {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>

            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(phase * 100)}
              onChange={(e) => {
                setPlaying(false);
                setPhase(Number(e.target.value) / 100);
              }}
              aria-label="Hareket aşamasını incele"
              className="flex-1 accent-[#6B8F78] h-1.5 bg-[#DCD3C6] rounded-lg cursor-pointer"
            />

            <button
              type="button"
              onClick={() => setSlowMo((s) => !s)}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                slowMo
                  ? 'bg-[#D98A7C] text-white'
                  : 'bg-white text-[#6E685F] hover:bg-[#FAF7F2]'
              }`}
            >
              {slowMo ? '0.5x Yavaş' : '1x Normal'}
            </button>

            <button
              type="button"
              onClick={() => {
                setPhase(0);
                setPlaying(true);
              }}
              className="w-8 h-8 rounded-full bg-white text-[#6E685F] hover:text-[#2D2A26] flex items-center justify-center shadow-xs transition cursor-pointer"
              title="Başa sar"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {tempo && (
            <div className="text-center text-xs text-[#6E685F]">
              Önerilen Tempo: <span className="font-semibold text-[#2D2A26]">{tempo}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
