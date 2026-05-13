
import { KeyValueResidual } from '../shared/KeyValueResidual';

const PERSON_CARD_KEYS = [
  "fullName",
  "headline",
  "tagline",
  "title",
  "email",
  "phone",
  "address",
  "bio",
  "summary",
  "avatar",
  "photoUrl",
  "avatarUrl",
];

export default function PersonalInfoDefault({ data, p }) {
  return <KeyValueResidual entries={Object.entries(data).filter(([k]) => !PERSON_CARD_KEYS.includes(k))} p={p} />;
}
