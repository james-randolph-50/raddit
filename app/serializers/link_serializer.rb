class LinkSerializer < ActiveModel::Serializer
	attributes :id, :title, :url, :user_id, :comments

	has_many :comments
  belongs_to :user, serializer: LinkAuthorSerializer
end