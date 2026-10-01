import { useEffect, useState } from "react";
import {
  Building2,
  Check,
  CircleUserRound,
  LoaderCircle,
  Mail,
  MapPin,
  Phone,
  Save,
  UserRound,
  X,
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import { useAuth } from "../../context/useAuth.js";

const inputClass = "h-11 w-full border border-[#dfe6df] bg-white px-3 text-[12px] text-[#314539] outline-none transition placeholder:text-[#a4aea6] focus:border-[#6e9578] focus:ring-2 focus:ring-[#719477]/15 disabled:cursor-wait disabled:bg-[#f5f7f4]";
const labelClass = "mb-1.5 block text-[10px] font-extrabold tracking-[.55px] text-[#5b6c60]";
const editableFields = ["name", "businessName", "phone", "address"];

const normalizeProfile = (source = {}) => ({
  name: typeof source.name === "string" ? source.name : "",
  email: typeof source.email === "string" ? source.email : "",
  businessName: typeof source.businessName === "string" ? source.businessName : "",
  phone: typeof source.phone === "string" ? source.phone : "",
  address: typeof source.address === "string" ? source.address : "",
});

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(() => normalizeProfile(user));
  const [savedProfile, setSavedProfile] = useState(() => normalizeProfile(user));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;
    axiosInstance.get(API_PATHS.AUTH.GET_PROFILE)
      .then(({ data }) => {
        if (!active) return;
        const currentProfile = normalizeProfile(data);
        setProfile(currentProfile);
        setSavedProfile(currentProfile);
        setError("");
      })
      .catch((requestError) => {
        if (active) setError(requestError.response?.data?.message || "Your latest profile details could not be loaded. You can still edit the details saved on this device.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const hasChanges = editableFields.some((field) => profile[field] !== savedProfile[field]);
  const completion = Math.round((editableFields.filter((field) => profile[field].trim()).length / editableFields.length) * 100);
  const accountName = profile.businessName || profile.name || "Your account";
  const initials = (profile.name || profile.businessName || "B")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const updateField = (field, value) => {
    setProfile((current) => ({ ...current, [field]: value }));
    setError("");
    setNotice("");
  };

  const discardChanges = () => {
    setProfile(savedProfile);
    setError("");
    setNotice("");
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");
    if (!profile.name.trim()) {
      setError("Your full name is required.");
      return;
    }

    setSaving(true);
    try {
      const payload = Object.fromEntries(editableFields.map((field) => [field, profile[field].trim()]));
      const { data } = await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, payload);
      const updatedProfile = normalizeProfile(data);
      setProfile(updatedProfile);
      setSavedProfile(updatedProfile);
      updateUser({ ...user, ...data });
      setNotice("Profile changes saved.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Your profile could not be saved. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1100px]">
      <header className="mb-6 border-b border-[#e0e7df] pb-5">
        <p className="text-[9px] font-extrabold tracking-[1.2px] text-[#87948a]">ACCOUNT SETTINGS</p>
        <h1 className="mt-1 text-[26px] font-extrabold text-[#20372c] sm:text-[30px]">Your profile</h1>
        <p className="mt-1 text-[12px] text-[#829086]">Manage your personal and business details used across BillCraft.</p>
      </header>

      {error && <p role="alert" className="mb-5 border-l-[3px] border-[#c25a46] bg-[#fff3ef] px-3 py-2.5 text-[10px] leading-4 text-[#9e4939]">{error}</p>}
      {notice && <p role="status" className="mb-5 flex items-center gap-2 border-l-[3px] border-[#6c936c] bg-[#edf5ec] px-3 py-2.5 text-[10px] leading-4 text-[#42634a]"><Check size={14} />{notice}</p>}

      <div className="grid items-start gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="overflow-hidden border border-[#e2e8e1] bg-white">
          <div className="h-2 bg-[#315b46]" />
          <div className="p-5 sm:p-6">
            <div className="flex items-center gap-3 lg:flex-col lg:items-start">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#eaf1e9] text-[17px] font-extrabold text-[#315b46]" aria-label={`${profile.name || "Account"} initials`}>
                {initials}
              </span>
              <div className="min-w-0">
                <h2 className="truncate text-[15px] font-extrabold text-[#2d4336]">{profile.name || "Your name"}</h2>
                <p className="mt-1 truncate text-[10px] text-[#829086]">{profile.email || "No email address"}</p>
              </div>
            </div>

            <div className="mt-5 border-t border-[#edf0ec] pt-4">
              <p className="text-[9px] font-extrabold tracking-[.8px] text-[#87948a]">BUSINESS</p>
              <p className="mt-1.5 flex items-center gap-2 text-[11px] font-semibold text-[#415649]"><Building2 size={14} className="shrink-0 text-[#78927d]" />{accountName}</p>
            </div>

            <div className="mt-5 border-t border-[#edf0ec] pt-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[9px] font-extrabold tracking-[.8px] text-[#87948a]">PROFILE DETAILS</p>
                <span className="text-[10px] font-bold tabular-nums text-[#426b4b]">{completion}%</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden bg-[#edf1ec]" role="progressbar" aria-label="Profile details completed" aria-valuemin={0} aria-valuemax={100} aria-valuenow={completion}>
                <div className="h-full bg-[#6c936c] transition-[width]" style={{ width: `${completion}%` }} />
              </div>
              <p className="mt-2 text-[9px] leading-4 text-[#8a968d]">Complete details help keep your invoices consistent.</p>
            </div>

            <div className="mt-5 flex items-center gap-2 border-t border-[#edf0ec] pt-4 text-[10px] font-semibold text-[#55745d]"><span className="h-2 w-2 rounded-full bg-[#6d9b6d]" /> Account active</div>
          </div>
        </aside>

        <form onSubmit={saveProfile} className="min-w-0 space-y-5">
          <section className="border border-[#e2e8e1] bg-white p-4 sm:p-6" aria-labelledby="profile-personal-heading">
            <div className="mb-5 flex items-center gap-3 border-b border-[#edf0ec] pb-4">
              <span className="grid h-8 w-8 place-items-center bg-[#eef3ee] text-[#477150]"><UserRound size={16} /></span>
              <div><h2 id="profile-personal-heading" className="text-[13px] font-extrabold text-[#31473a]">Personal information</h2><p className="mt-0.5 text-[10px] text-[#87948a]">The details associated with your account.</p></div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="profile-name" className={labelClass}>FULL NAME <span className="text-[#bb654c">*</span></label>
                <div className="relative"><CircleUserRound size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#91a096]" /><input id="profile-name" className={`${inputClass} pl-9`} autoComplete="name" maxLength={100} required disabled={loading || saving} value={profile.name} onChange={(event) => updateField("name", event.target.value)} placeholder="Your full name" /></div>
              </div>
              <div>
                <label htmlFor="profile-email" className={labelClass}>SIGN-IN EMAIL</label>
                <div className="relative"><Mail size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#91a096]" /><input id="profile-email" className={`${inputClass} pl-9`} type="email" autoComplete="email" readOnly value={profile.email} aria-describedby="profile-email-note" /></div>
                <p id="profile-email-note" className="mt-1.5 text-[9px] text-[#929d94]">Used to sign in to BillCraft.</p>
              </div>
            </div>
          </section>

          <section className="border border-[#e2e8e1] bg-white p-4 sm:p-6" aria-labelledby="profile-business-heading">
            <div className="mb-5 flex items-center gap-3 border-b border-[#edf0ec] pb-4">
              <span className="grid h-8 w-8 place-items-center bg-[#fff1e9] text-[#c26e3c]"><Building2 size={16} /></span>
              <div><h2 id="profile-business-heading" className="text-[13px] font-extrabold text-[#31473a]">Business details</h2><p className="mt-0.5 text-[10px] text-[#87948a]">Used to prefill new invoices.</p></div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="profile-business" className={labelClass}>BUSINESS NAME</label>
                <div className="relative"><Building2 size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#91a096]" /><input id="profile-business" className={`${inputClass} pl-9`} autoComplete="organization" maxLength={120} disabled={loading || saving} value={profile.businessName} onChange={(event) => updateField("businessName", event.target.value)} placeholder="Your business name" /></div>
              </div>
              <div>
                <label htmlFor="profile-phone" className={labelClass}>BUSINESS PHONE</label>
                <div className="relative"><Phone size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#91a096]" /><input id="profile-phone" className={`${inputClass} pl-9`} type="tel" autoComplete="tel" maxLength={30} disabled={loading || saving} value={profile.phone} onChange={(event) => updateField("phone", event.target.value)} placeholder="Phone number" /></div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="profile-address" className={labelClass}>BUSINESS ADDRESS</label>
                <div className="relative"><MapPin size={15} className="pointer-events-none absolute left-3 top-3 text-[#91a096]" /><textarea id="profile-address" className="min-h-24 w-full resize-y border border-[#dfe6df] bg-white py-2.5 pl-9 pr-3 text-[12px] leading-5 text-[#314539] outline-none transition placeholder:text-[#a4aea6] focus:border-[#6e9578] focus:ring-2 focus:ring-[#719477]/15 disabled:cursor-wait disabled:bg-[#f5f7f4]" autoComplete="street-address" maxLength={300} disabled={loading || saving} value={profile.address} onChange={(event) => updateField("address", event.target.value)} placeholder="Street, city, region, postal code" /></div>
              </div>
            </div>
          </section>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e0e7df] pt-4">
            <p className="text-[10px] text-[#87948a]">{loading ? "Loading your profile…" : hasChanges ? "You have unsaved changes." : "Your profile is up to date."}</p>
            <div className="flex items-center gap-2">
              {hasChanges && <button type="button" onClick={discardChanges} disabled={saving || loading} className="inline-flex h-10 items-center gap-2 border border-[#dce5dc] bg-white px-3 text-[10px] font-bold text-[#607165] hover:bg-[#f5f8f4] disabled:opacity-50"><X size={14} /> Discard</button>}
              <button type="submit" disabled={!hasChanges || saving || loading} className="inline-flex h-10 items-center gap-2 bg-[#e87643] px-4 text-[10px] font-extrabold text-white transition-colors hover:bg-[#d86636] disabled:cursor-not-allowed disabled:opacity-50">
                {saving ? <LoaderCircle size={14} className="animate-spin" /> : <Save size={14} />}{saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
