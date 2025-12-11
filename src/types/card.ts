/**
 * Card data structure from MTGA SQLite database
 */
export interface Card {
  GrpId: number;
  ArtId: number;
  ArtPath: string;
  TitleId: number;
  AltTitleId: number;
  InterchangeableTitleId: number;
  FlavorTextId: number;
  ReminderTextId: number;
  TypeTextId: number;
  SubtypeTextId: number;
  ArtistCredit: string;
  ArtSize: number;
  Rarity: number;
  ExpansionCode: string;
  DigitalReleaseSet: string;
  IsToken: number;
  IsPrimaryCard: number;
  IsDigitalOnly: number;
  IsRebalanced: number;
  RebalancedCardGrpId: number;
  DefunctRebalancedCardGrpId: number;
  AlternateDeckLimit: number;
  CollectorNumber: string;
  CollectorMax: string;
  CollectorSuffix: string;
  DraftContent: number;
  UsesSideboard: number;
  OldSchoolManaText: string;
  LinkedFaceType: number;
  RawFrameDetail: string;
  Watermark: string;
  TextChangeData: string;
  Power: string;
  Toughness: string;
  Colors: string;
  ColorIdentity: string;
  FrameColors: string;
  IndicatorColors: string;
  Types: string;
  Subtypes: string;
  Supertypes: string;
  AbilityIds: string;
  HiddenAbilityIds: string;
  LinkedFaceGrpIds: string;
  LinkedAbilityTemplateCardGrpIds: string;
  AbilityIdToLinkedTokenGrpId: string;
  AbilityIdToLinkedConjurations: string;
  KnownSupportedStyles: string;
  AdditionalFrameDetails: string;
  ExtraFrameDetails: string;
  Tags: string;
  PromoLabel: string;
  Order_LandLast: number;
  Order_ColorOrder: number;
  Order_CreaturesFirst: number;
  Order_ManaCostDifficulty: number;
  Order_CMCWithXLast: number;
  Order_Title: string;
  Order_MythicToCommon: number;
  Order_BasicLandsFirst: number;
}

/**
 * Localization entry from Localizations_enUS table
 */
export interface Localization {
  LocId: number;
  Formatted: number;
  Loc: string;
}

/**
 * Parsed ability ID entry
 */
export interface AbilityIdEntry {
  abilityId: number;
  locId: number;
}

/**
 * Card localization data for POT file generation
 */
export interface CardLocalizationData {
  grpId: number;
  titleId: number;
  typeTextId: number;
  subtypeTextId: number;
  flavorTextId?: number;
  reminderTextId?: number;
  abilityIds: AbilityIdEntry[];
  expansionCode: string;
  collectorNumber: string;
}
