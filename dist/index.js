var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";
import path from "path";
import fs from "fs";
import Stripe from "stripe";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  achievements: () => achievements,
  careerHistory: () => careerHistory,
  clubAchievements: () => clubAchievements,
  clubLikes: () => clubLikes,
  clubMediaFiles: () => clubMediaFiles,
  clubProfiles: () => clubProfiles,
  clubStats: () => clubStats,
  coachCareerHistory: () => coachCareerHistory,
  coachLikes: () => coachLikes,
  coachMediaFiles: () => coachMediaFiles,
  coachProfiles: () => coachProfiles,
  coachStats: () => coachStats,
  insertAchievementSchema: () => insertAchievementSchema,
  insertCareerHistorySchema: () => insertCareerHistorySchema,
  insertClubAchievementSchema: () => insertClubAchievementSchema,
  insertClubMediaFileSchema: () => insertClubMediaFileSchema,
  insertClubProfileSchema: () => insertClubProfileSchema,
  insertCoachCareerHistorySchema: () => insertCoachCareerHistorySchema,
  insertCoachMediaFileSchema: () => insertCoachMediaFileSchema,
  insertCoachProfileSchema: () => insertCoachProfileSchema,
  insertCoachStatsSchema: () => insertCoachStatsSchema,
  insertMediaFileSchema: () => insertMediaFileSchema,
  insertPlayerProfileSchema: () => insertPlayerProfileSchema,
  insertPlayerStatsSchema: () => insertPlayerStatsSchema,
  mediaFiles: () => mediaFiles,
  mediaLikes: () => mediaLikes,
  messageRequests: () => messageRequests,
  messages: () => messages,
  playerLikes: () => playerLikes,
  playerProfiles: () => playerProfiles,
  playerStats: () => playerStats,
  profileFollows: () => profileFollows,
  sessions: () => sessions,
  users: () => users
});
import { sql } from "drizzle-orm";
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  real,
  boolean,
  uuid
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull()
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  profileType: varchar("profile_type"),
  // player, coach, club - no default, must be chosen
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  isSubscribed: boolean("is_subscribed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var playerProfiles = pgTable("player_profiles", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  name: varchar("name").notNull(),
  dateOfBirth: timestamp("date_of_birth"),
  nationality: varchar("nationality"),
  position: varchar("position"),
  currentClub: varchar("current_club"),
  biography: text("biography"),
  profileImagePath: varchar("profile_image_path"),
  totalLikes: integer("total_likes").default(0),
  isPublic: boolean("is_public").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var playerStats = pgTable("player_stats", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  playerId: uuid("player_id").references(() => playerProfiles.id).notNull(),
  // Technical stats
  dribbling: integer("dribbling").default(10),
  finishing: integer("finishing").default(10),
  passing: integer("passing").default(10),
  crossing: integer("crossing").default(10),
  shooting: integer("shooting").default(10),
  // Physical stats
  pace: integer("pace").default(10),
  stamina: integer("stamina").default(10),
  strength: integer("strength").default(10),
  jumping: integer("jumping").default(10),
  // Mental stats
  vision: integer("vision").default(10),
  leadership: integer("leadership").default(10),
  determination: integer("determination").default(10),
  composure: integer("composure").default(10),
  // Goalkeeping stats (if applicable)
  handling: integer("handling").default(10),
  reflexes: integer("reflexes").default(10),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var careerHistory = pgTable("career_history", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  playerId: uuid("player_id").references(() => playerProfiles.id).notNull(),
  season: varchar("season").notNull(),
  // e.g., "2023-24"
  club: varchar("club").notNull(),
  league: varchar("league"),
  matches: integer("matches").default(0),
  goals: integer("goals").default(0),
  assists: integer("assists").default(0),
  yellowCards: integer("yellow_cards").default(0),
  redCards: integer("red_cards").default(0),
  averageRating: real("average_rating"),
  createdAt: timestamp("created_at").defaultNow()
});
var achievements = pgTable("achievements", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  playerId: uuid("player_id").references(() => playerProfiles.id).notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  year: integer("year"),
  type: varchar("type"),
  // trophy, individual_award, team_achievement
  createdAt: timestamp("created_at").defaultNow()
});
var mediaFiles = pgTable("media_files", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  playerId: uuid("player_id").references(() => playerProfiles.id).notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  filePath: varchar("file_path").notNull(),
  fileType: varchar("file_type").notNull(),
  // image, video
  mimeType: varchar("mime_type"),
  fileSize: integer("file_size"),
  duration: integer("duration"),
  // for videos in seconds
  likes: integer("likes").default(0),
  createdAt: timestamp("created_at").defaultNow()
});
var playerLikes = pgTable("player_likes", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  playerId: uuid("player_id").references(() => playerProfiles.id).notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var mediaLikes = pgTable("media_likes", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  mediaId: uuid("media_id").references(() => mediaFiles.id).notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var coachProfiles = pgTable("coach_profiles", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  name: varchar("name").notNull(),
  dateOfBirth: timestamp("date_of_birth"),
  nationality: varchar("nationality"),
  currentClub: varchar("current_club"),
  biography: text("biography"),
  profileImagePath: varchar("profile_image_path"),
  philosophy: text("philosophy"),
  // Philosophie de jeu
  strengths: text("strengths"),
  // Points forts
  developmentAreas: text("development_areas"),
  // Axes de progression
  totalLikes: integer("total_likes").default(0),
  isPublic: boolean("is_public").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var coachStats = pgTable("coach_stats", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  coachId: uuid("coach_id").references(() => coachProfiles.id).notNull(),
  // Coaching attributes
  attacking: integer("attacking").default(10),
  // Travail offensif
  defending: integer("defending").default(10),
  // Travail défensif
  mentalCoaching: integer("mental_coaching").default(10),
  // Préparation mentale
  tacticalKnowledge: integer("tactical_knowledge").default(10),
  // Connaissances tactiques
  technicalCoaching: integer("technical_coaching").default(10),
  // Travail technique
  // Management attributes
  manManagement: integer("man_management").default(10),
  // Gestion des hommes
  workingWithYoungsters: integer("working_with_youngsters").default(10),
  // Travail avec les jeunes
  motivation: integer("motivation").default(10),
  // Capacité de motivation
  determination: integer("determination").default(10),
  // Détermination
  // Knowledge attributes
  judgePlayerAbility: integer("judge_player_ability").default(10),
  // Évaluation des joueurs
  judgePlayerPotential: integer("judge_player_potential").default(10),
  // Évaluation du potentiel
  levelOfDiscipline: integer("level_of_discipline").default(10),
  // Niveau de discipline
  adaptability: integer("adaptability").default(10),
  // Adaptabilité
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var coachCareerHistory = pgTable("coach_career_history", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  coachId: uuid("coach_id").references(() => coachProfiles.id).notNull(),
  season: varchar("season").notNull(),
  club: varchar("club").notNull(),
  position: varchar("position"),
  // Entraîneur principal, adjoint, formateur, etc.
  league: varchar("league"),
  matches: integer("matches").default(0),
  wins: integer("wins").default(0),
  draws: integer("draws").default(0),
  losses: integer("losses").default(0),
  trophies: text("trophies"),
  // Trophées gagnés cette saison
  createdAt: timestamp("created_at").defaultNow()
});
var clubProfiles = pgTable("club_profiles", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  name: varchar("name").notNull(),
  foundedYear: integer("founded_year"),
  country: varchar("country"),
  city: varchar("city"),
  stadium: varchar("stadium"),
  stadiumCapacity: integer("stadium_capacity"),
  stadiumImagePath: varchar("stadium_image_path"),
  logoPath: varchar("logo_path"),
  numberOfTeams: integer("number_of_teams"),
  // Nombre d'équipes (pro, réserve, jeunes, etc.)
  colors: varchar("colors"),
  // Couleurs du club
  website: varchar("website"),
  description: text("description"),
  totalLikes: integer("total_likes").default(0),
  isPublic: boolean("is_public").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var clubStats = pgTable("club_stats", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  clubId: uuid("club_id").references(() => clubProfiles.id).notNull().unique(),
  // Infrastructure
  infrastructure: integer("infrastructure").default(10),
  // Qualité des installations
  trainingFacilities: integer("training_facilities").default(10),
  // Centre d'entraînement
  youthAcademy: integer("youth_academy").default(10),
  // Centre de formation
  // Gestion
  finances: integer("finances").default(10),
  // Santé financière
  commercialAppeal: integer("commercial_appeal").default(10),
  // Attractivité commerciale
  businessManagement: integer("business_management").default(10),
  // Gestion d'entreprise
  // Sportif
  scouting: integer("scouting").default(10),
  // Réseau de recrutement
  medicalStaff: integer("medical_staff").default(10),
  // Staff médical
  technicalStaff: integer("technical_staff").default(10),
  // Staff technique
  // Communauté
  supporters: integer("supporters").default(10),
  // Base de supporters
  stadiumAtmosphere: integer("stadium_atmosphere").default(10),
  // Ambiance au stade
  mediaPresence: integer("media_presence").default(10),
  // Présence médiatique
  // Vision
  youthDevelopment: integer("youth_development").default(10),
  // Développement des jeunes
  projectAmbition: integer("project_ambition").default(10),
  // Ambition du projet
  internationalReputation: integer("international_reputation").default(10),
  // Réputation internationale
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var clubAchievements = pgTable("club_achievements", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  clubId: uuid("club_id").references(() => clubProfiles.id).notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  year: integer("year"),
  type: varchar("type"),
  // championship, cup, european_trophy, etc.
  createdAt: timestamp("created_at").defaultNow()
});
var clubMediaFiles = pgTable("club_media_files", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  clubId: uuid("club_id").references(() => clubProfiles.id).notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  filePath: varchar("file_path").notNull(),
  fileType: varchar("file_type").notNull(),
  // image, video
  mimeType: varchar("mime_type"),
  fileSize: integer("file_size"),
  duration: integer("duration"),
  // for videos in seconds
  likes: integer("likes").default(0),
  createdAt: timestamp("created_at").defaultNow()
});
var coachMediaFiles = pgTable("coach_media_files", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  coachId: uuid("coach_id").references(() => coachProfiles.id).notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  filePath: varchar("file_path").notNull(),
  fileType: varchar("file_type").notNull(),
  // image, video
  mimeType: varchar("mime_type"),
  fileSize: integer("file_size"),
  duration: integer("duration"),
  // for videos in seconds
  likes: integer("likes").default(0),
  createdAt: timestamp("created_at").defaultNow()
});
var coachLikes = pgTable("coach_likes", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  coachId: uuid("coach_id").references(() => coachProfiles.id).notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var clubLikes = pgTable("club_likes", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  clubId: uuid("club_id").references(() => clubProfiles.id).notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var profileFollows = pgTable("profile_follows", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  followerId: varchar("follower_id").references(() => users.id).notNull(),
  followingId: varchar("following_id").references(() => users.id).notNull(),
  status: varchar("status").default("pending"),
  // pending, accepted, blocked
  createdAt: timestamp("created_at").defaultNow()
});
var messages = pgTable("messages", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  senderId: varchar("sender_id").references(() => users.id).notNull(),
  recipientId: varchar("recipient_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow()
});
var messageRequests = pgTable("message_requests", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  senderId: varchar("sender_id").references(() => users.id).notNull(),
  recipientId: varchar("recipient_id").references(() => users.id).notNull(),
  message: text("message"),
  // Message initial de présentation
  status: varchar("status").default("pending"),
  // pending, accepted, rejected
  createdAt: timestamp("created_at").defaultNow()
});
var insertPlayerProfileSchema = createInsertSchema(playerProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertPlayerStatsSchema = createInsertSchema(playerStats).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertCareerHistorySchema = createInsertSchema(careerHistory).omit({
  id: true,
  createdAt: true
});
var insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  createdAt: true
});
var insertMediaFileSchema = createInsertSchema(mediaFiles).omit({
  id: true,
  createdAt: true
});
var insertCoachProfileSchema = createInsertSchema(coachProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertCoachStatsSchema = createInsertSchema(coachStats).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertCoachCareerHistorySchema = createInsertSchema(coachCareerHistory).omit({
  id: true,
  createdAt: true
});
var insertCoachMediaFileSchema = createInsertSchema(coachMediaFiles).omit({
  id: true,
  createdAt: true
});
var insertClubProfileSchema = createInsertSchema(clubProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertClubAchievementSchema = createInsertSchema(clubAchievements).omit({
  id: true,
  createdAt: true
});
var insertClubMediaFileSchema = createInsertSchema(clubMediaFiles).omit({
  id: true,
  createdAt: true
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, desc, sql as sql2, and } from "drizzle-orm";
var DatabaseStorage = class {
  // User operations
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async upsertUser(userData) {
    const [user] = await db.insert(users).values(userData).onConflictDoUpdate({
      target: users.id,
      set: {
        ...userData,
        updatedAt: /* @__PURE__ */ new Date()
      }
    }).returning();
    return user;
  }
  async updateUserStripeInfo(userId, customerId, subscriptionId) {
    const [user] = await db.update(users).set({
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      isSubscribed: true,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(users.id, userId)).returning();
    return user;
  }
  async updateUserProfileType(userId, profileType) {
    const [user] = await db.update(users).set({
      profileType,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(users.id, userId)).returning();
    return user;
  }
  // Player profile operations
  async getPlayerProfile(userId) {
    const [profile] = await db.select().from(playerProfiles).where(eq(playerProfiles.userId, userId));
    return profile;
  }
  async createPlayerProfile(profile) {
    const [newProfile] = await db.insert(playerProfiles).values(profile).returning();
    return newProfile;
  }
  async updatePlayerProfile(id, profile) {
    const [updatedProfile] = await db.update(playerProfiles).set({ ...profile, updatedAt: /* @__PURE__ */ new Date() }).where(eq(playerProfiles.id, id)).returning();
    return updatedProfile;
  }
  // Player stats operations
  async getPlayerStats(playerId) {
    const [stats] = await db.select().from(playerStats).where(eq(playerStats.playerId, playerId));
    return stats;
  }
  async upsertPlayerStats(stats) {
    const [upsertedStats] = await db.insert(playerStats).values(stats).onConflictDoUpdate({
      target: playerStats.playerId,
      set: { ...stats, updatedAt: /* @__PURE__ */ new Date() }
    }).returning();
    return upsertedStats;
  }
  // Career history operations
  async getCareerHistory(playerId) {
    return await db.select().from(careerHistory).where(eq(careerHistory.playerId, playerId)).orderBy(desc(careerHistory.season));
  }
  async addCareerHistory(history) {
    const [newHistory] = await db.insert(careerHistory).values(history).returning();
    return newHistory;
  }
  async updateCareerHistory(id, history) {
    const [updatedHistory] = await db.update(careerHistory).set(history).where(eq(careerHistory.id, id)).returning();
    return updatedHistory;
  }
  async deleteCareerHistory(id) {
    await db.delete(careerHistory).where(eq(careerHistory.id, id));
  }
  // Achievement operations
  async getAchievements(playerId) {
    return await db.select().from(achievements).where(eq(achievements.playerId, playerId)).orderBy(desc(achievements.year));
  }
  async addAchievement(achievement) {
    const [newAchievement] = await db.insert(achievements).values(achievement).returning();
    return newAchievement;
  }
  async deleteAchievement(id) {
    await db.delete(achievements).where(eq(achievements.id, id));
  }
  // Media operations
  async getMediaFiles(playerId) {
    return await db.select().from(mediaFiles).where(eq(mediaFiles.playerId, playerId)).orderBy(desc(mediaFiles.createdAt));
  }
  async addMediaFile(media) {
    const [newMedia] = await db.insert(mediaFiles).values(media).returning();
    return newMedia;
  }
  async updateMediaFile(id, media) {
    const [updatedMedia] = await db.update(mediaFiles).set(media).where(eq(mediaFiles.id, id)).returning();
    return updatedMedia;
  }
  async deleteMediaFile(id) {
    await db.delete(mediaFiles).where(eq(mediaFiles.id, id));
  }
  // Coach profile operations
  async getCoachProfile(userId) {
    const [profile] = await db.select().from(coachProfiles).where(eq(coachProfiles.userId, userId));
    return profile;
  }
  async createCoachProfile(profile) {
    const [newProfile] = await db.insert(coachProfiles).values(profile).returning();
    return newProfile;
  }
  async updateCoachProfile(id, profile) {
    const [updatedProfile] = await db.update(coachProfiles).set({ ...profile, updatedAt: /* @__PURE__ */ new Date() }).where(eq(coachProfiles.id, id)).returning();
    return updatedProfile;
  }
  // Coach stats operations
  async getCoachStats(coachId) {
    const [stats] = await db.select().from(coachStats).where(eq(coachStats.coachId, coachId));
    return stats;
  }
  async upsertCoachStats(stats) {
    const [upsertedStats] = await db.insert(coachStats).values(stats).onConflictDoUpdate({
      target: coachStats.coachId,
      set: { ...stats, updatedAt: /* @__PURE__ */ new Date() }
    }).returning();
    return upsertedStats;
  }
  // Club profile operations
  async getClubProfile(userId) {
    const [profile] = await db.select().from(clubProfiles).where(eq(clubProfiles.userId, userId));
    return profile;
  }
  async createClubProfile(profile) {
    const [newProfile] = await db.insert(clubProfiles).values(profile).returning();
    return newProfile;
  }
  async updateClubProfile(id, profile) {
    const [updatedProfile] = await db.update(clubProfiles).set({ ...profile, updatedAt: /* @__PURE__ */ new Date() }).where(eq(clubProfiles.id, id)).returning();
    return updatedProfile;
  }
  // Club stats operations
  async getClubStats(clubId) {
    const [stats] = await db.select().from(clubStats).where(eq(clubStats.clubId, clubId));
    return stats;
  }
  async upsertClubStats(stats) {
    const [upsertedStats] = await db.insert(clubStats).values(stats).onConflictDoUpdate({
      target: clubStats.clubId,
      set: { ...stats, updatedAt: /* @__PURE__ */ new Date() }
    }).returning();
    return upsertedStats;
  }
  // Social operations
  async likePlayer(userId, playerId) {
    const [like] = await db.insert(playerLikes).values({ userId, playerId }).returning();
    await db.update(playerProfiles).set({ totalLikes: sql2`${playerProfiles.totalLikes} + 1` }).where(eq(playerProfiles.id, playerId));
    return like;
  }
  async unlikePlayer(userId, playerId) {
    await db.delete(playerLikes).where(and(
      eq(playerLikes.userId, userId),
      eq(playerLikes.playerId, playerId)
    ));
    await db.update(playerProfiles).set({ totalLikes: sql2`${playerProfiles.totalLikes} - 1` }).where(eq(playerProfiles.id, playerId));
  }
  async hasLikedPlayer(userId, playerId) {
    const [like] = await db.select().from(playerLikes).where(and(
      eq(playerLikes.userId, userId),
      eq(playerLikes.playerId, playerId)
    ));
    return !!like;
  }
  async likeMedia(userId, mediaId) {
    const [like] = await db.insert(mediaLikes).values({ userId, mediaId }).returning();
    await db.update(mediaFiles).set({ likes: sql2`${mediaFiles.likes} + 1` }).where(eq(mediaFiles.id, mediaId));
    return like;
  }
  async unlikeMedia(userId, mediaId) {
    await db.delete(mediaLikes).where(and(
      eq(mediaLikes.userId, userId),
      eq(mediaLikes.mediaId, mediaId)
    ));
    await db.update(mediaFiles).set({ likes: sql2`${mediaFiles.likes} - 1` }).where(eq(mediaFiles.id, mediaId));
  }
  async hasLikedMedia(userId, mediaId) {
    const [like] = await db.select().from(mediaLikes).where(and(
      eq(mediaLikes.userId, userId),
      eq(mediaLikes.mediaId, mediaId)
    ));
    return !!like;
  }
  // Rankings
  async getTopPlayers(limit = 10) {
    return await db.select().from(playerProfiles).where(eq(playerProfiles.isPublic, true)).orderBy(desc(playerProfiles.totalLikes)).limit(limit);
  }
  async getTopMedia(limit = 10) {
    return await db.select().from(mediaFiles).orderBy(desc(mediaFiles.likes)).limit(limit);
  }
};
var storage = new DatabaseStorage();

// server/replitAuth.ts
import * as client from "openid-client";
import { Strategy } from "openid-client/passport";
import passport from "passport";
import session from "express-session";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}
var getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID
    );
  },
  { maxAge: 3600 * 1e3 }
);
function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1e3;
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    ttl: sessionTtl,
    tableName: "sessions"
  });
  return session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      maxAge: sessionTtl
    }
  });
}
function updateUserSession(user, tokens) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}
async function upsertUser(claims) {
  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"]
  });
}
async function setupAuth(app2) {
  app2.set("trust proxy", 1);
  app2.use(getSession());
  app2.use(passport.initialize());
  app2.use(passport.session());
  const config = await getOidcConfig();
  const verify = async (tokens, verified) => {
    const user = {};
    updateUserSession(user, tokens);
    await upsertUser(tokens.claims());
    verified(null, user);
  };
  for (const domain of process.env.REPLIT_DOMAINS.split(",")) {
    const strategy = new Strategy(
      {
        name: `replitauth:${domain}`,
        config,
        scope: "openid email profile offline_access",
        callbackURL: `https://${domain}/api/callback`
      },
      verify
    );
    passport.use(strategy);
  }
  passport.serializeUser((user, cb) => cb(null, user));
  passport.deserializeUser((user, cb) => cb(null, user));
  app2.get("/api/login", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"]
    })(req, res, next);
  });
  app2.get("/api/callback", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/login"
    })(req, res, next);
  });
  app2.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`
        }).href
      );
    });
  });
}
var isAuthenticated = async (req, res, next) => {
  const user = req.user;
  if (!req.isAuthenticated() || !user.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const now = Math.floor(Date.now() / 1e3);
  if (now <= user.expires_at) {
    return next();
  }
  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};

// server/objectStorage.ts
import { Storage } from "@google-cloud/storage";
import { randomUUID } from "crypto";

// server/objectAcl.ts
var ACL_POLICY_METADATA_KEY = "custom:aclPolicy";
function isPermissionAllowed(requested, granted) {
  if (requested === "read" /* READ */) {
    return ["read" /* READ */, "write" /* WRITE */].includes(granted);
  }
  return granted === "write" /* WRITE */;
}
function createObjectAccessGroup(group) {
  switch (group.type) {
    // Implement the case for each type of access group to instantiate.
    //
    // For example:
    // case "USER_LIST":
    //   return new UserListAccessGroup(group.id);
    // case "EMAIL_DOMAIN":
    //   return new EmailDomainAccessGroup(group.id);
    // case "GROUP_MEMBER":
    //   return new GroupMemberAccessGroup(group.id);
    // case "SUBSCRIBER":
    //   return new SubscriberAccessGroup(group.id);
    default:
      throw new Error(`Unknown access group type: ${group.type}`);
  }
}
async function setObjectAclPolicy(objectFile, aclPolicy) {
  const [exists] = await objectFile.exists();
  if (!exists) {
    throw new Error(`Object not found: ${objectFile.name}`);
  }
  await objectFile.setMetadata({
    metadata: {
      [ACL_POLICY_METADATA_KEY]: JSON.stringify(aclPolicy)
    }
  });
}
async function getObjectAclPolicy(objectFile) {
  const [metadata] = await objectFile.getMetadata();
  const aclPolicy = metadata?.metadata?.[ACL_POLICY_METADATA_KEY];
  if (!aclPolicy) {
    return null;
  }
  return JSON.parse(aclPolicy);
}
async function canAccessObject({
  userId,
  objectFile,
  requestedPermission
}) {
  const aclPolicy = await getObjectAclPolicy(objectFile);
  if (!aclPolicy) {
    return false;
  }
  if (aclPolicy.visibility === "public" && requestedPermission === "read" /* READ */) {
    return true;
  }
  if (!userId) {
    return false;
  }
  if (aclPolicy.owner === userId) {
    return true;
  }
  for (const rule of aclPolicy.aclRules || []) {
    const accessGroup = createObjectAccessGroup(rule.group);
    if (await accessGroup.hasMember(userId) && isPermissionAllowed(requestedPermission, rule.permission)) {
      return true;
    }
  }
  return false;
}

// server/objectStorage.ts
var REPLIT_SIDECAR_ENDPOINT = "http://127.0.0.1:1106";
var objectStorageClient = new Storage({
  credentials: {
    audience: "replit",
    subject_token_type: "access_token",
    token_url: `${REPLIT_SIDECAR_ENDPOINT}/token`,
    type: "external_account",
    credential_source: {
      url: `${REPLIT_SIDECAR_ENDPOINT}/credential`,
      format: {
        type: "json",
        subject_token_field_name: "access_token"
      }
    },
    universe_domain: "googleapis.com"
  },
  projectId: ""
});
var ObjectNotFoundError = class _ObjectNotFoundError extends Error {
  constructor() {
    super("Object not found");
    this.name = "ObjectNotFoundError";
    Object.setPrototypeOf(this, _ObjectNotFoundError.prototype);
  }
};
var ObjectStorageService = class {
  constructor() {
  }
  // Gets the public object search paths.
  getPublicObjectSearchPaths() {
    const pathsStr = process.env.PUBLIC_OBJECT_SEARCH_PATHS || "";
    const paths = Array.from(
      new Set(
        pathsStr.split(",").map((path4) => path4.trim()).filter((path4) => path4.length > 0)
      )
    );
    if (paths.length === 0) {
      throw new Error(
        "PUBLIC_OBJECT_SEARCH_PATHS not set. Create a bucket in 'Object Storage' tool and set PUBLIC_OBJECT_SEARCH_PATHS env var (comma-separated paths)."
      );
    }
    return paths;
  }
  // Gets the private object directory.
  getPrivateObjectDir() {
    const dir = process.env.PRIVATE_OBJECT_DIR || "";
    if (!dir) {
      throw new Error(
        "PRIVATE_OBJECT_DIR not set. Create a bucket in 'Object Storage' tool and set PRIVATE_OBJECT_DIR env var."
      );
    }
    return dir;
  }
  // Search for a public object from the search paths.
  async searchPublicObject(filePath) {
    for (const searchPath of this.getPublicObjectSearchPaths()) {
      const fullPath = `${searchPath}/${filePath}`;
      const { bucketName, objectName } = parseObjectPath(fullPath);
      const bucket = objectStorageClient.bucket(bucketName);
      const file = bucket.file(objectName);
      const [exists] = await file.exists();
      if (exists) {
        return file;
      }
    }
    return null;
  }
  // Downloads an object to the response.
  async downloadObject(file, res, cacheTtlSec = 3600) {
    try {
      const [metadata] = await file.getMetadata();
      const aclPolicy = await getObjectAclPolicy(file);
      const isPublic = aclPolicy?.visibility === "public";
      res.set({
        "Content-Type": metadata.contentType || "application/octet-stream",
        "Content-Length": metadata.size,
        "Cache-Control": `${isPublic ? "public" : "private"}, max-age=${cacheTtlSec}`
      });
      const stream = file.createReadStream();
      stream.on("error", (err) => {
        console.error("Stream error:", err);
        if (!res.headersSent) {
          res.status(500).json({ error: "Error streaming file" });
        }
      });
      stream.pipe(res);
    } catch (error) {
      console.error("Error downloading file:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Error downloading file" });
      }
    }
  }
  // Gets the upload URL for an object entity.
  async getObjectEntityUploadURL() {
    const privateObjectDir = this.getPrivateObjectDir();
    if (!privateObjectDir) {
      throw new Error(
        "PRIVATE_OBJECT_DIR not set. Create a bucket in 'Object Storage' tool and set PRIVATE_OBJECT_DIR env var."
      );
    }
    const objectId = randomUUID();
    const fullPath = `${privateObjectDir}/uploads/${objectId}`;
    const { bucketName, objectName } = parseObjectPath(fullPath);
    return signObjectURL({
      bucketName,
      objectName,
      method: "PUT",
      ttlSec: 900
    });
  }
  // Gets the object entity file from the object path.
  async getObjectEntityFile(objectPath) {
    if (!objectPath.startsWith("/objects/")) {
      throw new ObjectNotFoundError();
    }
    const parts = objectPath.slice(1).split("/");
    if (parts.length < 2) {
      throw new ObjectNotFoundError();
    }
    const entityId = parts.slice(1).join("/");
    let entityDir = this.getPrivateObjectDir();
    if (!entityDir.endsWith("/")) {
      entityDir = `${entityDir}/`;
    }
    const objectEntityPath = `${entityDir}${entityId}`;
    const { bucketName, objectName } = parseObjectPath(objectEntityPath);
    const bucket = objectStorageClient.bucket(bucketName);
    const objectFile = bucket.file(objectName);
    const [exists] = await objectFile.exists();
    if (!exists) {
      throw new ObjectNotFoundError();
    }
    return objectFile;
  }
  normalizeObjectEntityPath(rawPath) {
    if (!rawPath.startsWith("https://storage.googleapis.com/")) {
      return rawPath;
    }
    const url = new URL(rawPath);
    const rawObjectPath = url.pathname;
    let objectEntityDir = this.getPrivateObjectDir();
    if (!objectEntityDir.endsWith("/")) {
      objectEntityDir = `${objectEntityDir}/`;
    }
    if (!rawObjectPath.startsWith(objectEntityDir)) {
      return rawObjectPath;
    }
    const entityId = rawObjectPath.slice(objectEntityDir.length);
    return `/objects/${entityId}`;
  }
  // Tries to set the ACL policy for the object entity and return the normalized path.
  async trySetObjectEntityAclPolicy(rawPath, aclPolicy) {
    const normalizedPath = this.normalizeObjectEntityPath(rawPath);
    if (!normalizedPath.startsWith("/")) {
      return normalizedPath;
    }
    const objectFile = await this.getObjectEntityFile(normalizedPath);
    await setObjectAclPolicy(objectFile, aclPolicy);
    return normalizedPath;
  }
  // Checks if the user can access the object entity.
  async canAccessObjectEntity({
    userId,
    objectFile,
    requestedPermission
  }) {
    return canAccessObject({
      userId,
      objectFile,
      requestedPermission: requestedPermission ?? "read" /* READ */
    });
  }
};
function parseObjectPath(path4) {
  if (!path4.startsWith("/")) {
    path4 = `/${path4}`;
  }
  const pathParts = path4.split("/");
  if (pathParts.length < 3) {
    throw new Error("Invalid path: must contain at least a bucket name");
  }
  const bucketName = pathParts[1];
  const objectName = pathParts.slice(2).join("/");
  return {
    bucketName,
    objectName
  };
}
async function signObjectURL({
  bucketName,
  objectName,
  method,
  ttlSec
}) {
  const request = {
    bucket_name: bucketName,
    object_name: objectName,
    method,
    expires_at: new Date(Date.now() + ttlSec * 1e3).toISOString()
  };
  const response = await fetch(
    `${REPLIT_SIDECAR_ENDPOINT}/object-storage/signed-object-url`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(request)
    }
  );
  if (!response.ok) {
    throw new Error(
      `Failed to sign object URL, errorcode: ${response.status}, make sure you're running on Replit`
    );
  }
  const { signed_url: signedURL } = await response.json();
  return signedURL;
}

// server/routes.ts
var stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-27.basil"
}) : null;
async function registerRoutes(app2) {
  app2.use("/manifest.json", (_req, res) => {
    res.sendFile(path.resolve(process.cwd(), "client/public/manifest.json"));
  });
  app2.use("/service-worker.js", (_req, res) => {
    res.sendFile(path.resolve(process.cwd(), "client/public/service-worker.js"));
  });
  app2.use("/offline.html", (_req, res) => {
    res.sendFile(path.resolve(process.cwd(), "client/public/offline.html"));
  });
  app2.use("/icon-*.svg", (req, res) => {
    const filename = req.path.substring(1);
    res.sendFile(path.resolve(process.cwd(), "client/public", filename));
  });
  app2.use("/favicon-*.svg", (req, res) => {
    const filename = req.path.substring(1);
    res.sendFile(path.resolve(process.cwd(), "client/public", filename));
  });
  app2.use("/apple-touch-icon.svg", (_req, res) => {
    res.sendFile(path.resolve(process.cwd(), "client/public/apple-touch-icon.svg"));
  });
  app2.post("/share", (req, res) => {
    console.log("\u{1F4E4} Contenu partag\xE9 re\xE7u:", req.body);
    res.redirect("/?shared=true");
  });
  app2.get("/open-file", (req, res) => {
    console.log("\u{1F4C1} Fichier ouvert:", req.query);
    res.redirect("/?fileOpened=true");
  });
  app2.get("/handle-protocol", (req, res) => {
    console.log("\u{1F517} Lien protocol re\xE7u:", req.query.url);
    res.redirect("/?protocolHandled=true");
  });
  await setupAuth(app2);
  app2.get("/api/auth/user", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  app2.post("/api/create-subscription", isAuthenticated, async (req, res) => {
    if (!stripe) {
      return res.status(503).json({ error: "Payment processing not configured. Please add Stripe API keys." });
    }
    const user = req.user.claims;
    if (!user.email) {
      return res.status(400).json({ error: "No user email on file" });
    }
    try {
      let dbUser = await storage.getUser(user.sub);
      if (dbUser?.stripeSubscriptionId) {
        const subscription2 = await stripe.subscriptions.retrieve(dbUser.stripeSubscriptionId);
        if (subscription2.status === "active") {
          return res.json({
            subscriptionId: subscription2.id,
            clientSecret: typeof subscription2.latest_invoice === "object" && subscription2.latest_invoice?.payment_intent ? subscription2.latest_invoice.payment_intent.client_secret : void 0
          });
        }
      }
      const customer = await stripe.customers.create({
        email: user.email,
        name: `${user.first_name} ${user.last_name}`
      });
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{
          price: process.env.STRIPE_PRICE_ID
        }],
        payment_behavior: "default_incomplete",
        expand: ["latest_invoice.payment_intent"]
      });
      await storage.updateUserStripeInfo(user.sub, customer.id, subscription.id);
      res.json({
        subscriptionId: subscription.id,
        clientSecret: typeof subscription.latest_invoice === "object" && subscription.latest_invoice?.payment_intent ? subscription.latest_invoice.payment_intent.client_secret : void 0
      });
    } catch (error) {
      console.error("Stripe error:", error);
      res.status(400).json({ error: error.message });
    }
  });
  app2.get("/api/player-profile", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const profile = await storage.getPlayerProfile(userId);
      res.json(profile);
    } catch (error) {
      console.error("Error fetching player profile:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });
  app2.post("/api/player-profile", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const profileData = insertPlayerProfileSchema.parse({ ...req.body, userId });
      const profile = await storage.createPlayerProfile(profileData);
      res.json(profile);
    } catch (error) {
      console.error("Error creating player profile:", error);
      res.status(400).json({ message: error.message });
    }
  });
  app2.put("/api/player-profile/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const profileData = req.body;
      const profile = await storage.updatePlayerProfile(id, profileData);
      res.json(profile);
    } catch (error) {
      console.error("Error updating player profile:", error);
      res.status(400).json({ message: error.message });
    }
  });
  app2.get("/api/player-stats/:playerId", isAuthenticated, async (req, res) => {
    try {
      const { playerId } = req.params;
      const stats = await storage.getPlayerStats(playerId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching player stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });
  app2.post("/api/player-stats", isAuthenticated, async (req, res) => {
    try {
      const statsData = insertPlayerStatsSchema.parse(req.body);
      const stats = await storage.upsertPlayerStats(statsData);
      res.json(stats);
    } catch (error) {
      console.error("Error updating player stats:", error);
      res.status(400).json({ message: error.message });
    }
  });
  app2.get("/api/career-history/:playerId", isAuthenticated, async (req, res) => {
    try {
      const { playerId } = req.params;
      const history = await storage.getCareerHistory(playerId);
      res.json(history);
    } catch (error) {
      console.error("Error fetching career history:", error);
      res.status(500).json({ message: "Failed to fetch career history" });
    }
  });
  app2.post("/api/career-history", isAuthenticated, async (req, res) => {
    try {
      const historyData = insertCareerHistorySchema.parse(req.body);
      const history = await storage.addCareerHistory(historyData);
      res.json(history);
    } catch (error) {
      console.error("Error adding career history:", error);
      res.status(400).json({ message: error.message });
    }
  });
  app2.delete("/api/career-history/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteCareerHistory(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting career history:", error);
      res.status(500).json({ message: "Failed to delete career history" });
    }
  });
  app2.get("/api/achievements/:playerId", isAuthenticated, async (req, res) => {
    try {
      const { playerId } = req.params;
      const achievements2 = await storage.getAchievements(playerId);
      res.json(achievements2);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });
  app2.post("/api/achievements", isAuthenticated, async (req, res) => {
    try {
      const achievementData = insertAchievementSchema.parse(req.body);
      const achievement = await storage.addAchievement(achievementData);
      res.json(achievement);
    } catch (error) {
      console.error("Error adding achievement:", error);
      res.status(400).json({ message: error.message });
    }
  });
  app2.get("/api/media/:playerId", isAuthenticated, async (req, res) => {
    try {
      const { playerId } = req.params;
      const media = await storage.getMediaFiles(playerId);
      res.json(media);
    } catch (error) {
      console.error("Error fetching media:", error);
      res.status(500).json({ message: "Failed to fetch media" });
    }
  });
  app2.post("/api/media", isAuthenticated, async (req, res) => {
    try {
      const mediaData = insertMediaFileSchema.parse(req.body);
      const media = await storage.addMediaFile(mediaData);
      res.json(media);
    } catch (error) {
      console.error("Error adding media:", error);
      res.status(400).json({ message: error.message });
    }
  });
  app2.get("/objects/:objectPath(*)", isAuthenticated, async (req, res) => {
    const userId = req.user?.claims?.sub;
    const objectStorageService = new ObjectStorageService();
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      const canAccess = await objectStorageService.canAccessObjectEntity({
        objectFile,
        userId,
        requestedPermission: "read" /* READ */
      });
      if (!canAccess) {
        return res.sendStatus(401);
      }
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error checking object access:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });
  app2.post("/api/objects/upload", isAuthenticated, async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    const uploadURL = await objectStorageService.getObjectEntityUploadURL();
    res.json({ uploadURL });
  });
  app2.put("/api/media-files", isAuthenticated, async (req, res) => {
    if (!req.body.fileURL) {
      return res.status(400).json({ error: "fileURL is required" });
    }
    const userId = req.user?.claims?.sub;
    try {
      const objectStorageService = new ObjectStorageService();
      const objectPath = await objectStorageService.trySetObjectEntityAclPolicy(
        req.body.fileURL,
        {
          owner: userId,
          visibility: "public"
        }
      );
      res.status(200).json({ objectPath });
    } catch (error) {
      console.error("Error setting media file:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  app2.post("/api/like-player/:playerId", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const { playerId } = req.params;
      const hasLiked = await storage.hasLikedPlayer(userId, playerId);
      if (hasLiked) {
        await storage.unlikePlayer(userId, playerId);
        res.json({ liked: false });
      } else {
        await storage.likePlayer(userId, playerId);
        res.json({ liked: true });
      }
    } catch (error) {
      console.error("Error toggling player like:", error);
      res.status(500).json({ message: "Failed to toggle like" });
    }
  });
  app2.post("/api/like-media/:mediaId", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const { mediaId } = req.params;
      const hasLiked = await storage.hasLikedMedia(userId, mediaId);
      if (hasLiked) {
        await storage.unlikeMedia(userId, mediaId);
        res.json({ liked: false });
      } else {
        await storage.likeMedia(userId, mediaId);
        res.json({ liked: true });
      }
    } catch (error) {
      console.error("Error toggling media like:", error);
      res.status(500).json({ message: "Failed to toggle like" });
    }
  });
  app2.post("/api/profile-type", async (req, res) => {
    try {
      const userId = req.user?.claims?.sub || "demo-user-" + Date.now();
      const { profileType } = req.body;
      if (!["player", "coach", "club"].includes(profileType)) {
        return res.status(400).json({ message: "Invalid profile type" });
      }
      res.json({ success: true, profileType });
    } catch (error) {
      console.error("Error setting profile type:", error);
      res.status(500).json({ message: error.message });
    }
  });
  app2.post("/api/player", async (req, res) => {
    try {
      const userId = req.user?.claims?.sub || "demo-user-" + Date.now();
      const { stats, achievements: achievements2, mediaFiles: mediaFiles2, ...profileData } = req.body;
      const profile = await storage.createPlayerProfile({ ...profileData, userId });
      if (stats) {
        await storage.upsertPlayerStats({ ...stats, playerId: profile.id });
      }
      if (achievements2 && achievements2.length > 0) {
        for (const achievement of achievements2) {
          if (achievement.title) {
            await storage.addAchievement({ ...achievement, playerId: profile.id });
          }
        }
      }
      if (mediaFiles2 && mediaFiles2.length > 0) {
        for (const media of mediaFiles2) {
          if (media.title) {
            await storage.addMediaFile({
              ...media,
              playerId: profile.id,
              filePath: "/placeholder",
              // placeholder until file upload is implemented
              fileType: media.type || "image"
            });
          }
        }
      }
      res.json(profile);
    } catch (error) {
      console.error("Error creating player:", error);
      res.status(400).json({ message: error.message });
    }
  });
  app2.post("/api/coach", async (req, res) => {
    try {
      const userId = req.user?.claims?.sub || "demo-user-" + Date.now();
      const { stats, achievements: achievements2, mediaFiles: mediaFiles2, ...profileData } = req.body;
      const profile = await storage.createCoachProfile({ ...profileData, userId });
      if (stats) {
        await storage.upsertCoachStats({ ...stats, coachId: profile.id });
      }
      res.json(profile);
    } catch (error) {
      console.error("Error creating coach:", error);
      res.status(400).json({ message: error.message });
    }
  });
  app2.post("/api/club", async (req, res) => {
    try {
      const userId = req.user?.claims?.sub || "demo-user-" + Date.now();
      const { stats, achievements: achievements2, mediaFiles: mediaFiles2, ...profileData } = req.body;
      const profile = await storage.createClubProfile({ ...profileData, userId });
      if (stats) {
        await storage.upsertClubStats({ ...stats, clubId: profile.id });
      }
      res.json(profile);
    } catch (error) {
      console.error("Error creating club:", error);
      res.status(400).json({ message: error.message });
    }
  });
  app2.get("/download-archive", (req, res) => {
    const filePath = path.resolve(process.cwd(), "my-story-football-clean.tar.gz");
    res.download(filePath, "my-story-football.tar.gz", (err) => {
      if (err) {
        console.error("Erreur t\xE9l\xE9chargement:", err);
        res.status(404).send("Fichier non trouv\xE9");
      }
    });
  });
  app2.get("/download-github-bundle", (req, res) => {
    try {
      const existingArchive = path.resolve(process.cwd(), "my-story-football-clean.tar.gz");
      if (fs.existsSync(existingArchive)) {
        const fileName = "my-story-football-github-ready.tar.gz";
        res.setHeader("Content-Type", "application/gzip");
        res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
        res.setHeader("Cache-Control", "no-cache");
        const stream = fs.createReadStream(existingArchive);
        stream.pipe(res);
        stream.on("error", (err) => {
          console.error("Erreur stream:", err);
          if (!res.headersSent) {
            res.status(500).send("Erreur lecture fichier");
          }
        });
        return;
      }
      res.status(404).send("Bundle non disponible. Veuillez r\xE9essayer plus tard.");
    } catch (error) {
      console.error("Erreur t\xE9l\xE9chargement bundle:", error);
      res.status(500).send("Erreur serveur");
    }
  });
  app2.get("/api/rankings/players", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const topPlayers = await storage.getTopPlayers(limit);
      res.json(topPlayers);
    } catch (error) {
      console.error("Error fetching top players:", error);
      res.status(500).json({ message: "Failed to fetch rankings" });
    }
  });
  app2.get("/api/rankings/media", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const topMedia = await storage.getTopMedia(limit);
      res.json(topMedia);
    } catch (error) {
      console.error("Error fetching top media:", error);
      res.status(500).json({ message: "Failed to fetch media rankings" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs2 from "fs";
import path3 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path2 from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path2.resolve(import.meta.dirname, "client", "src"),
      "@shared": path2.resolve(import.meta.dirname, "shared"),
      "@assets": path2.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path2.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path2.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path3.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path3.resolve(import.meta.dirname, "public");
  if (!fs2.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path3.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path4 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path4.startsWith("/api")) {
      let logLine = `${req.method} ${path4} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
