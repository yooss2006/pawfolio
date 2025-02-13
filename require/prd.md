# Pawfolio PRD

## Project Overview

이 프로젝트는 전통적인 텍스트 기반 자기소개 대신, 사용자가 인상 깊게 느낀 **영화**, **음악**, **명언**, **장소**, **음식**, **유튜브 영상** 등 다양한 콘텐츠를 마치 전시회장에서 전시하듯 자유롭게 게시할 수 있는 웹 서비스입니다.  
4 x 6 블록 그리드 위에 콘텐츠를 배치하고 공유함으로써, 사용자 각자의 취향과 스토리를 보다 감각적으로 표현할 수 있도록 돕는 것을 목표로 합니다.

핵심 기능:

- 4 x 6 블록 그리드 기반의 **시각적 전시** 방식
- **FloatButton**을 통한 직관적인 게시물 생성 및 모달 인터페이스 제공
- **드래그 앤 드롭**을 이용한 콘텐츠 위치 조정 및 시각적 피드백
- 완성된 전시공간 **공유** 및 SNS 게시

### 프로젝트 목적 및 목표

- **보다 창의적인 방식**으로 자기소개를 할 수 있는 서비스 제공
- 모바일 및 웹 환경에서 **간편하게 콘텐츠를 등록**할 수 있도록 인터페이스 최적화
- 전시 형태의 자기소개를 **공유**하고, 타인과의 **커뮤니케이션 활성화**
- 향후 확장 가능한 아키텍처 구축(초기에는 로컬 스토리지, 이후 DB 연동)

### 사용자 대상

- 연령 : 10대 후반 ~ 30대 초반
- 특성 : **콘텐츠 큐레이션**에 관심이 많고, SNS에 **활발하게 공유**하는 성향
- 선호 : 쉽고 직관적인 **UI/UX**, **자기표현**을 중시하는 디자인

---

## Core Functionalities

### 1. 게시물 생성 및 모달 인터페이스

- **FloatButton 클릭 시 확장 애니메이션**을 통해 모달 화면으로 전환
- 모달 상단에 "게시하고 싶은 내용은 무엇인가요?"라는 안내 문구와 함께, **중복되지 않는 3종류의 무작위 질문**이 표시
- 사용자가 특정 질문(예: 영화, 문구 등)을 선택하면 해당 **입력 양식**(검색 API, 텍스트 입력 등)을 제공

### 2. 4 x 6 그리드 콘텐츠 관리

- **생성된 콘텐츠**는 모달 종료 후 그리드에 자동 배치
- 콘텐츠별 **미리 설정된 크기**(예: 2 x 3, 1 x 3 등)로 표시
- **우측 상단의 X 버튼**을 통한 콘텐츠 삭제 (삭제 시 FloatButton 재등장)

### 3. 드래그 앤 드롭 및 시각적 피드백

- 콘텐츠 요소는 **그리드 내 자유롭게 드래그 앤 드롭** 가능
- 배치 가능 영역은 **초록색 테두리**, 배치 불가능 영역(이미 다른 콘텐츠가 있는 경우)은 **빨간색 테두리**로 표시
- 드롭 시 초록색 영역에 놓인 경우 "영역에 붙이겠습니까?" 라는 Alert
  - **Yes**: 해당 위치에 확정 적용
  - **No**: 다시 드래그하여 재배치
- 드래그 앤 드롭 라이브러리: dnd-kit을 활용하여 구현

### 4. 데이터 저장 및 공유

- **위치 정보**는 초기 개발 단계에서는 **로컬 스토리지**에 저장 → 최종 개발 단계에서 **DB 연동**(Supabase, Prisma)
- **공유하기 버튼** 클릭 시 전시공간의 **URL**을 복사/공유
- **SNS 공유** 버튼을 통해 전시공간의 이미지를 캡쳐하여 SNS에 직접 업로드할 수 있도록 지원 (또는 메타 태그 활용)

### 5. 로그인 및 사용자 관리

- **간편한 로그인/회원가입** 프로세스 제공
  - 이메일과 비밀번호를 통한 기본 인증
  - 초기 단계에서는 로컬 스토리지 활용 (추후 Supabase Auth로 마이그레이션 예정)
- **로그인 상태 유지** 기능
- **보안을 고려한 비밀번호 관리**
  - 비밀번호 최소 길이 및 복잡성 요구사항 적용
  - 비밀번호 해싱 처리 (crypto-js 활용)

---

## Documentation

### 필요한 패키지와 라이브러리

- **Next.js** : 서버 사이드 렌더링 및 라우팅, React 기반 웹 프레임워크
- **Tailwind CSS** : 반응형 UI 구현 및 유틸리티 퍼스트 CSS 프레임워크
- **shadcn/ui** : Tailwind CSS와 호환되는 고수준 UI 컴포넌트 라이브러리
- **Supabase** : 인증, DB, 스토리지 등 백엔드 서버리스 기능(이 프로젝트에서는 DB로만 활용)
- **Drizzle** : TypeScript 기반 ORM, Supabase Drizzle DB 연동 및 스키마 정의
- **lucide-react** : 아이콘 라이브러리
- **crypto-js** : 비밀번호 해싱 및 보안 처리
- **dnd-kit** : 드래그 앤 드롭 기능 구현을 위한 React 기반 라이브러리
- **pnpm** : 패키지 매니저로 프로젝트 관리 및 성능 최적화

---

## Design Guide

- **컨셉**: 전시회장에서 각종 작품을 관람하듯, **시각적이고 감각적인** 분위기
- **컬러 팔레트**:
  - Primary: #4729b2 (theme-primary)
  - Secondary: #694fbf (theme-secondary)
  - Accent: #e5334f (theme-accent)
  - Background: #f0edef (theme-background)
- **폰트**:
  - 기본 폰트: Geist Sans
  - 모노스페이스 폰트: Geist Mono

---

## Current File Structure

📦 pawfolio
├── 📂 app
│ ├── 📂 api
│ │ └── 📂 movies
│ │ └── 📂 search
│ │ └── 📄 route.ts
│ ├── 📂 login
│ │ └── 📄 page.tsx
│ ├── 📄 globals.css
│ ├── 📄 layout.tsx
│ └── 📄 page.tsx
├── 📂 components
│ ├── 📂 ui
│ │ ├── 📄 button.tsx
│ │ ├── 📄 card.tsx
│ │ ├── 📄 drawer.tsx
│ │ ├── 📄 form.tsx
│ │ ├── 📄 input.tsx
│ │ └── 📄 label.tsx
│ └── 📂 features
│ ├── 📂 create-content
│ │ ├── 📂 drawer-contents
│ │ │ ├── 📄 drawer-content-container.tsx
│ │ │ ├── 📄 movie-search.tsx
│ │ │ ├── 📄 question-answer-content.tsx
│ │ │ ├── 📄 question-drawer-header.tsx
│ │ │ └── 📄 question-selection-content.tsx
│ │ ├── 📄 create-content-drawer.tsx
│ │ └── 📄 types.ts
│ ├── 📂 float-button
│ │ └── 📄 float-button.tsx
│ └── 📂 grid
│ └── 📄 grid-container.tsx
├── 📂 lib
│ ├── 📂 constants
│ │ └── 📄 questions.ts
│ └── 📄 utils.ts
├── 📂 public
│ └── ...
├── 📂 require
│ └── 📄 prd.md
└── 📄 기타 설정 파일들
