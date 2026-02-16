export interface IntroItem {
  title: string;
  content: string;
}

export interface PointsTable {
  headers: string[];
  rows: string[][];
}

export interface LevelUpItem {
  title: string;
  description: string;
}

export interface LevelUpData {
  title: string;
  levels: LevelUpItem[];
}

export interface RewardPointsData {
  intro: IntroItem[];
  pointsTable: PointsTable;
  levelUp: LevelUpData;
}
