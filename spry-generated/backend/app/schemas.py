from datetime import datetime, timezone

from pydantic import (
    AwareDatetime,
    BaseModel,
    ConfigDict,
    Field,
    field_serializer,
    field_validator,
    model_validator,
)


class MeetingCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    title: str = Field(min_length=1, max_length=200)
    starts_at: AwareDatetime
    ends_at: AwareDatetime
    attendee_count: int = Field(ge=0)

    @field_validator("title")
    @classmethod
    def title_not_blank(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("title must not be blank")
        return value

    @model_validator(mode="after")
    def ends_not_before_starts(self) -> "MeetingCreate":
        if self.ends_at < self.starts_at:
            raise ValueError("ends_at must not be before starts_at")
        return self


class MeetingRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    starts_at: datetime
    ends_at: datetime
    attendee_count: int

    @field_serializer("starts_at", "ends_at")
    def serialize_utc(self, value: datetime) -> datetime:
        return value.astimezone(timezone.utc)
