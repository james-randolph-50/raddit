class CommentSerializer < ActiveModel::Serializer
  attributes :id, :user_id, :link_id, :body
  
  belongs_to :user
  belongs_to :link
end
