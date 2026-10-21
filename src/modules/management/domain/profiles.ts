export type AvatarGender = "male" | "female" | "neutral";
export type AvatarAge = "young" | "adult" | "mature";
// Fictional profiles supplied only to seed the local prototype, never inferred
// from a user's name. Real registrations explicitly choose an avatar style.
export const seedProfiles: Record<string, { age: number; avatarGender: AvatarGender }> = {
  marina: { age: 26, avatarGender: "female" }, pedro: { age: 33, avatarGender: "male" }, ana: { age: 42, avatarGender: "female" }, lucas: { age: 23, avatarGender: "male" }, beatriz: { age: 36, avatarGender: "female" }, rafael: { age: 31, avatarGender: "male" }, julia: { age: 22, avatarGender: "female" }, bruno: { age: 44, avatarGender: "male" }, carla: { age: 59, avatarGender: "female" }, diego: { age: 38, avatarGender: "male" }, elisa: { age: 63, avatarGender: "female" }, felipe: { age: 61, avatarGender: "male" }, gabriela: { age: 29, avatarGender: "female" },
};
export function avatarAge(age?: number): AvatarAge { return age === undefined ? "adult" : age < 30 ? "young" : age < 55 ? "adult" : "mature"; }
export function avatarPosition(age?: number, gender: AvatarGender = "neutral", choice?: AvatarAge | "auto") {
  const group = choice && choice !== "auto" ? choice : avatarAge(age);
  return { backgroundPosition: `${group === "young" ? 0 : group === "adult" ? 50 : 100}% ${gender === "female" ? 100 : 0}%` };
}
