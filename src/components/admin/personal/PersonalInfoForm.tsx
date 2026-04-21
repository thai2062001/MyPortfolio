import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, User, Sparkles } from "lucide-react";
import { PersonalInfo } from "@/types/admin";
import { useLang } from "@/contexts/LangContext";

interface PersonalInfoFormProps {
  formData: PersonalInfo;
  setFormData: (data: PersonalInfo) => void;
}

export const PersonalInfoForm = ({
  formData,
  setFormData,
}: PersonalInfoFormProps) => {
  const { t } = useLang();

  return (
    <div className="space-y-12 max-w-2xl text-left">
      <div className="space-y-4">
        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
          {t("Full Name", "フルネーム", "Họ và tên")}
        </label>
        <div className="relative group">
          <User
            className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-sage transition-colors"
            size={20}
          />
          <Input
            value={formData.full_name || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                full_name: e.target.value,
              })
            }
            placeholder={t("Your full name", "あなたのフルネーム", "Họ và tên của bạn")}
            className="h-14 pl-14 pr-5 bg-white/70 border border-sage/20 rounded-xl md:rounded-2xl text-base md:text-lg font-serif shadow-sm italic font-bold focus:bg-white focus:border-sage transition-all"
          />
        </div>
      </div>
      <div className="space-y-4">
        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
          {t("Professional Bio", "プロフィールの自己紹介", "Tiểu sử chuyên môn")}
        </label>
        <div className="relative group">
          <Sparkles
            className="absolute left-6 top-6 text-muted-foreground group-focus-within:text-sage transition-colors"
            size={20}
          />
          <Textarea
            value={formData.bio || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                bio: e.target.value,
              })
            }
            placeholder={t("Tell the world about your expertise...", "あなたの専門知識について世界に伝えましょう...", "Hãy giới thiệu về chuyên môn của bạn...")}
            className="min-h-[150px] pl-14 pr-5 pt-5 bg-white/70 border border-sage/20 rounded-xl md:rounded-2xl text-base md:text-lg font-serif shadow-sm italic focus:bg-white focus:border-sage transition-all resize-none"
          />
        </div>
      </div>
      <div className="space-y-4">
        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
          {t("Email Address", "メールアドレス", "Địa chỉ Email")}
        </label>
        <div className="relative group">
          <Mail
            className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-sage transition-colors"
            size={20}
          />
          <Input
            value={formData.email || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                email: e.target.value,
              })
            }
            placeholder="email@example.com"
            className="h-14 pl-14 pr-5 bg-white/70 border border-sage/20 rounded-xl md:rounded-2xl text-base md:text-lg font-serif shadow-sm italic font-bold focus:bg-white focus:border-sage transition-all"
          />
        </div>
      </div>
      <div className="space-y-4">
        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
          {t("Phone Number", "電話番号", "Số điện thoại")}
        </label>
        <div className="relative group">
          <Phone
            className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-sage transition-colors"
            size={20}
          />
          <Input
            value={formData.phone_number || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                phone_number: e.target.value,
              })
            }
            placeholder="+000 0000 000"
            className="h-14 pl-14 pr-5 bg-white/70 border border-sage/20 rounded-xl md:rounded-2xl text-base md:text-lg font-serif shadow-sm italic font-bold focus:bg-white focus:border-sage transition-all"
          />
        </div>
      </div>
      <div className="space-y-4">
        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-3">
          {t("Address", "住所", "Địa chỉ")}
        </label>
        <div className="relative group">
          <MapPin
            className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-sage transition-colors"
            size={20}
          />
          <Input
            value={formData.address || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                address: e.target.value,
              })
            }
            placeholder={t("City, Country", "都市、国", "Thành phố, Quốc gia")}
            className="h-14 pl-14 pr-5 bg-white/70 border border-sage/20 rounded-xl md:rounded-2xl text-base md:text-lg font-serif shadow-sm italic font-bold focus:bg-white focus:border-sage transition-all"
          />
        </div>
      </div>
    </div>
  );
};
